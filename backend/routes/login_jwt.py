from fastapi import APIRouter, Form, Request
from fastapi.responses import JSONResponse
from utils import log_request

import base64
import json

router = APIRouter()

def fake_jwt(username):
    header = base64.urlsafe_b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode()).decode().rstrip("=")
    payload = base64.urlsafe_b64encode(json.dumps({"sub": username, "role": "admin"}).encode()).decode().rstrip("=")
    return f"{header}.{payload}.insecure_signature"

@router.post("/login-jwt")
async def login_jwt(request: Request, username: str = Form(...), password: str = Form(...)):
    log_request(request, f"JWT_LOGIN username={username}, password={password}")
    if username and password:
        token = fake_jwt(username)
        return JSONResponse(content={"message": "Login OK", "token": token})
    return JSONResponse(content={"error": "Invalid"}, status_code=401)
