from fastapi import APIRouter, Request
from utils import log_request

router = APIRouter()

@router.post("/track")
async def track(request: Request):
    data = await request.json()
    log_request(request, f"TRACK: {data}")
    return {"status": "logged"}

@router.get("/track/token-jwt")
async def log_token_view(request: Request):
    log_request(request, "JWT Token visualisé dans FakePHP.js")
    return {"status": "tracked"}
@router.post("/track/token-used")
async def token_used(request: Request):
    body = await request.json()
    auth = request.headers.get("Authorization", "None")
    log_request(request, f"TOKEN USED → {auth} | Detail: {body.get('detail')}")
    return {"message": "🧪 Token reçu et traité"}
