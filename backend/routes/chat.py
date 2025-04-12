from fastapi import APIRouter, Request, Form
from utils import log_request

router = APIRouter()
CHAT_MESSAGES = []

@router.get("/chat")
async def get_messages():
    return {"messages": CHAT_MESSAGES}

@router.post("/chat/send")
async def send_message(request: Request, username: str = Form(...), message: str = Form(...)):
    log_request(request, f"CHAT {username}: {message}")
    CHAT_MESSAGES.append(f"<b>{username}</b>: {message}")
    return {"status": "sent"}
