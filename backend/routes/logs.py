from fastapi import APIRouter
from fastapi.responses import PlainTextResponse
import os

router = APIRouter()

@router.get("/logs", response_class=PlainTextResponse)
async def get_logs():
    try:
        with open("logs/http.log", "r") as f:
            return f.read()
    except FileNotFoundError:
        return "No logs found."
