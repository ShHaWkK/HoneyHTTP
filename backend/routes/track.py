from fastapi import APIRouter, Request
from utils import log_request

router = APIRouter()

@router.post("/track")
async def track(request: Request):
    data = await request.json()
    log_request(request, f"TRACK: {data}")
    return {"status": "logged"}
