# 📁 backend/routes/auth.py
from fastapi import APIRouter, Form, Request
from fastapi.responses import JSONResponse
import base64, json, time, sqlite3
from utils import log_request

router = APIRouter()

# Brute-force
BRUTE_FORCE = {}
LOCKOUT = 60
MAX_ATTEMPTS = 3

def fake_jwt(username: str) -> str:
    header = base64.urlsafe_b64encode(json.dumps({"alg":"HS256"}).encode()).decode().rstrip("=")
    payload= base64.urlsafe_b64encode(json.dumps({"sub":username,"role":"admin"}).encode()).decode().rstrip("=")
    return f"{header}.{payload}.insecure_signature"

@router.post("/login")
async def login(request: Request, username: str = Form(...), password: str = Form(...)):
    ip = request.client.host
    key = f"{ip}:{username}"
    now = time.time()
    # lockout ?
    if key in BRUTE_FORCE and BRUTE_FORCE[key][0]>=MAX_ATTEMPTS and now-BRUTE_FORCE[key][1]<LOCKOUT:
        log_request(request, f"LOCKED_OUT {username}")
        return JSONResponse(status_code=403, content={"error":"Account locked"})
    # check creds in sqlite
    conn = sqlite3.connect("honeypot.db")
    cur  = conn.cursor()
    cur.execute("SELECT * FROM users WHERE username=? AND password=?", (username,password))
    ok = cur.fetchone() is not None
    if ok:
        token = fake_jwt(username)
        log_request(request, f"LOGIN_OK {username}")
        BRUTE_FORCE.pop(key, None)
        return {"message":"Login success","token":token}
    # else invalid
    BRUTE_FORCE[key] = [ BRUTE_FORCE.get(key,[0,now])[0]+1, now ]
    log_request(request, f"LOGIN_FAIL {username}")
    return JSONResponse(status_code=401, content={"error":"Invalid credentials"})
