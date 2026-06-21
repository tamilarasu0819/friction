from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# --- THE VIP PASS (CORS CONFIGURATION) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

class UserMessage(BaseModel):
    message: str

@app.post("/api/chat")
async def chat(user_msg: UserMessage):
    return {
        "emotion_detected": "analytical",
        "bot_reply": f"I received your message: {user_msg.message}"
    }