import os
from fastapi import FastAPI
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

class UserMessage(BaseModel):
    message: str

@app.post("/api/chat")
async def chat(user_msg: UserMessage):
    client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))
    response = client.models.generate_content(model='gemini-2.0-flash', contents=user_msg.message)
    return {"bot_reply": response.text}
