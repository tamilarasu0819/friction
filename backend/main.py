import os
import uuid
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from database import get_db, User, Conversation, Message
from auth import verify_google_token
from typing import Optional, Dict, List, Any

load_dotenv()

app = FastAPI()

GUEST_SESSIONS: Dict[str, List[dict]] = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
        
        if not idinfo:
            if not conversation_id or conversation_id not in GUEST_SESSIONS:
                conversation_id = "guest_" + str(uuid.uuid4())
                GUEST_SESSIONS[conversation_id] = [{"role": "system", "content": "You are the Friction RAG Engine. You must adapt your tone and formatting based on the user's input:\n1. Casual Conversation: If the user simply says hello, greets you, or makes small talk, reply naturally, warmly, and briefly in a single sentence. Do NOT use markdown, bullet points, or formal status reports for greetings.\n2. Technical/Factual Queries: If the user asks a specific question, requests an explanation, or queries the knowledge base, instantly switch to providing highly structured, direct, and concise answers using markdown, bold text, and bullet points."}]
            
            chat_history = GUEST_SESSIONS[conversation_id]
            chat_history.append({"role": "user", "content": user_msg.message})
            
            chat_completion = client.chat.completions.create(
                messages=chat_history,
                model=user_msg.model, 
            )
            
            bot_response = chat_completion.choices[0].message.content
            chat_history.append({"role": "assistant", "content": bot_response})
            
            return {
                "bot_reply": bot_response,
                "active_model": user_msg.model,
                "conversation_id": conversation_id
            }

        user_id = idinfo.get("sub")
        chat_history = [{"role": "system", "content": "You are the Friction RAG Engine. You must adapt your tone and formatting based on the user's input:\n1. Casual Conversation: If the user simply says hello, greets you, or makes small talk, reply naturally, warmly, and briefly in a single sentence. Do NOT use markdown, bullet points, or formal status reports for greetings.\n2. Technical/Factual Queries: If the user asks a specific question, requests an explanation, or queries the knowledge base, instantly switch to providing highly structured, direct, and concise answers using markdown, bold text, and bullet points."}]
        
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
        
        chat_completion = client.chat.completions.create(
            messages=chat_history,
            model=user_msg.model, 
        )
        
        bot_response = chat_completion.choices[0].message.content
        
        bot_msg_id = str(uuid.uuid4())
        db.add(Message(id=bot_msg_id, conversation_id=conversation_id, role="assistant", content=bot_response))
        db.commit()
        
        return {
            "bot_reply": bot_response,
            "active_model": user_msg.model,
            "conversation_id": conversation_id
        }
        
    except Exception as e:
        return {"bot_reply": f"Friction Engine Error: {str(e)}", "active_model": "None"}