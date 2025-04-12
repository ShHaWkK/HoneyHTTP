from fastapi import APIRouter, Form, Request
from fastapi.responses import JSONResponse
from utils import log_request
import base64, json

router = APIRouter()

def fake_jwt(username):
    h = base64.urlsafe_b64encode(json.dumps({"alg": "HS256"}).encode()).decode().rstrip("=")
    p = base64.urlsafe_b64encode(json.dumps({"sub": username, "role": "admin"}).encode()).decode().rstrip("=")
    return f"{h}.{p}.insecure_signature"

@router.post("/login-jwt")
async def login_jwt(request: Request, username: str = Form(...), password: str = Form(...)):
    log_request(request, f"JWT_LOGIN username={username}, password={password}")
    token = fake_jwt(username)
    return JSONResponse(content={"message": "Login OK", "token": token})
