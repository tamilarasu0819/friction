import os
import uuid
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from groq import Groq
from fastapi import UploadFile, File
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pypdf import PdfReader
import io
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from database import get_db, User, Conversation, Message
from auth import verify_google_token
from typing import Optional, Dict, List, Any

load_dotenv()

app = FastAPI()

GUEST_SESSIONS: Dict[str, List[dict]] = {}

# Initialize remote embeddings via Hugging Face API to save memory
embeddings = HuggingFaceInferenceAPIEmbeddings(
    api_key=os.environ.get("HF_TOKEN"),
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Initialize ChromaDB in memory
vector_store = Chroma(embedding_function=embeddings)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Conversation-Id"],
)

class UserMessage(BaseModel):
    message: str
    model: str = "llama-3.1-8b-instant"
    conversation_id: Optional[str] = None

@app.post("/api/auth")
async def authenticate_user(idinfo: Optional[dict] = Depends(verify_google_token), db: Session = Depends(get_db)):
    if not idinfo:
        raise HTTPException(status_code=401, detail="Authentication required")
    user_id = idinfo.get("sub")
    email = idinfo.get("email")
    name = idinfo.get("name")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = User(id=user_id, email=email, name=name)
        db.add(user)
        db.commit()
    
    return {"status": "success", "user": {"id": user.id, "email": user.email, "name": user.name}}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # 1. Read file into memory
        content = await file.read()
        
        # 2. Extract Text using PyPDF
        pdf_reader = PdfReader(io.BytesIO(content))
        raw_text = ""
        for page in pdf_reader.pages:
            raw_text += page.extract_text() + "\n"
            
        # 3. Chunk the Text
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        chunks = text_splitter.split_text(raw_text)
        
        # 4. Store in Vector Database
        vector_store.add_texts(chunks)
        
        return {
            "filename": file.filename,
            "status": "Embedded",
            "chunks_processed": len(chunks),
            "message": "File successfully embedded into Vector DB"
        }
    except Exception as e:
        return {"filename": file.filename, "status": "Error", "message": str(e)}

@app.get("/api/conversations")
async def get_conversations(idinfo: Optional[dict] = Depends(verify_google_token), db: Session = Depends(get_db)):
    if not idinfo:
        return []
    user_id = idinfo.get("sub")
    conversations = db.query(Conversation).filter(Conversation.user_id == user_id).order_by(Conversation.updated_at.desc()).all()
    return [{"id": c.id, "title": c.title, "updated_at": c.updated_at} for c in conversations]

@app.get("/api/chat/{conversation_id}")
async def get_chat_history(conversation_id: str, idinfo: Optional[dict] = Depends(verify_google_token), db: Session = Depends(get_db)):
    if not idinfo:
        if conversation_id in GUEST_SESSIONS:
            msgs = GUEST_SESSIONS[conversation_id]
            result = []
            for m in msgs:
                if m["role"] != "system":
                    result.append({
                        "id": str(uuid.uuid4()),
                        "role": m["role"],
                        "content": m["content"],
                        "timestamp": None
                    })
            return result
        raise HTTPException(status_code=404, detail="Conversation not found")

    user_id = idinfo.get("sub")
    conv = db.query(Conversation).filter(Conversation.id == conversation_id, Conversation.user_id == user_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    msgs = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.timestamp.asc()).all()
    return [{"id": m.id, "role": m.role, "content": m.content, "timestamp": m.timestamp} for m in msgs]

@app.post("/api/chat")
async def chat(user_msg: UserMessage, idinfo: Optional[dict] = Depends(verify_google_token), db: Session = Depends(get_db)):
    try:
        client = Groq(api_key=os.getenv('GROQ_API_KEY'))
        conversation_id = user_msg.conversation_id
        
        # 1. Retrieve Context
        retrieved_docs = vector_store.similarity_search(user_msg.message, k=3)
        context_text = "\n\n".join([doc.page_content for doc in retrieved_docs])

        # 2. Build the RAG System Prompt
        rag_system_prompt = f"""You are Friction AI, an intelligent technical assistant.
Use the following retrieved context from the user's Knowledge Base to answer their question. 
If the answer is not contained in the context, use your general knowledge, but prioritize the provided context.

Context:
{context_text}
"""

        # Setup conversation and history
        chat_history = [{"role": "system", "content": rag_system_prompt}]
        
        user_id = idinfo.get("sub") if idinfo else None

        if not idinfo:
            if not conversation_id or conversation_id not in GUEST_SESSIONS:
                conversation_id = "guest_" + str(uuid.uuid4())
                GUEST_SESSIONS[conversation_id] = list(chat_history)
            
            history = GUEST_SESSIONS[conversation_id]
            history.append({"role": "user", "content": user_msg.message})
            chat_history = history
        else:
            if conversation_id:
                conv = db.query(Conversation).filter(Conversation.id == conversation_id, Conversation.user_id == user_id).first()
                if not conv:
                    raise HTTPException(status_code=404, detail="Conversation not found")
                msgs = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.timestamp.asc()).all()
                for m in msgs:
                    chat_history.append({"role": m.role, "content": m.content})
            else:
                conversation_id = str(uuid.uuid4())
                title = user_msg.message[:30] + "..." if len(user_msg.message) > 30 else user_msg.message
                new_conv = Conversation(id=conversation_id, user_id=user_id, title=title)
                db.add(new_conv)
                db.commit()

            new_msg_id = str(uuid.uuid4())
            db.add(Message(id=new_msg_id, conversation_id=conversation_id, role="user", content=user_msg.message))
            db.commit()
            
            chat_history.append({"role": "user", "content": user_msg.message})

        # Generator function for streaming
        def generate():
            bot_response = ""
            try:
                stream = client.chat.completions.create(
                    messages=chat_history,
                    model=user_msg.model, 
                    stream=True
                )
                for chunk in stream:
                    content = chunk.choices[0].delta.content
                    if content is not None:
                        bot_response += content
                        yield content
            except Exception as e:
                yield f"Friction Engine Error: {str(e)}"
                
            # After stream completes, save to DB or Memory
            if not idinfo:
                GUEST_SESSIONS[conversation_id].append({"role": "assistant", "content": bot_response})
            else:
                bot_msg_id = str(uuid.uuid4())
                db.add(Message(id=bot_msg_id, conversation_id=conversation_id, role="assistant", content=bot_response))
                db.commit()

        headers = {"X-Conversation-Id": conversation_id}
        return StreamingResponse(generate(), media_type="text/event-stream", headers=headers)
        
    except Exception as e:
        return StreamingResponse((f"Friction Engine Error: {str(e)}" for _ in range(1)), media_type="text/event-stream")