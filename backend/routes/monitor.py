from fastapi import APIRouter
from fastapi.responses import PlainTextResponse

router = APIRouter()

@router.get("/tokens", response_class=PlainTextResponse)
def show_tokens():
    try:
        with open("logs/http.log", "r") as f:
            content = f.read()
        tokens = [line for line in content.splitlines() if "JWT_LOGIN" in line]
        return "\n".join(tokens) or "No tokens found."
    except:
        return "Log not found."

@router.get("/trackings", response_class=PlainTextResponse)
def show_tracking():
    try:
        with open("logs/http.log", "r") as f:
            content = f.read()
        events = [line for line in content.splitlines() if "TRACK" in line]
        return "\n".join(events) or "No user behavior recorded."
    except:
        return "Tracking data missing."
