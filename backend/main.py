from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class UserMessage(BaseModel):
    message: str

@app.post("/api/chat")
async def chat(user_msg: UserMessage):
    return {"emotion_detected": "analytical", "bot_reply": f"I received your message: {user_msg.message}"}
