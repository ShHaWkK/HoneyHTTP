from fastapi import APIRouter
from fastapi.responses import PlainTextResponse

router = APIRouter()

@router.get("/logs", response_class=PlainTextResponse)
def read_logs():
    try:
        with open("logs/http.log", "r") as f:
            return f.read()
    except:
        return "No logs yet."
