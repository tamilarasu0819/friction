import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

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

chat_history = [
    {"role": "system", "content": "You are the Friction RAG Engine. Give direct, markdown-formatted answers."}
]

@app.post("/api/chat")
async def chat(user_msg: UserMessage):
    try:
        client = Groq(api_key=os.getenv('GROQ_API_KEY'))
        
        chat_history.append({"role": "user", "content": user_msg.message})
        
        chat_completion = client.chat.completions.create(
            messages=chat_history,
            model=user_msg.model, 
        )
        
        bot_response = chat_completion.choices[0].message.content
        chat_history.append({"role": "assistant", "content": bot_response})
        
        # Now returning both the reply AND the verified model name used
        return {
            "bot_reply": bot_response,
            "active_model": user_msg.model
        }
        
    except Exception as e:
        if len(chat_history) > 1 and chat_history[-1]["role"] == "user":
            chat_history.pop()
        return {"bot_reply": f"Friction Engine Error: {str(e)}", "active_model": "None"}