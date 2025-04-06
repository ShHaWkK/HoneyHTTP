from fastapi import APIRouter, Request, Form
from utils import log_request

router = APIRouter()
XSS_MESSAGES = []

@router.post("/comment")
async def comment(request: Request, message: str = Form(...)):
    log_request(request, f"XSS comment={message}")
    XSS_MESSAGES.append(message)
    return {"status": "ok"}

@router.get("/comments")
async def get_comments():
    return {"comments": XSS_MESSAGES}
