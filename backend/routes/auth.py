
from fastapi import APIRouter, Form, Request
from utils import log_request
from fastapi.responses import JSONResponse
import sqlite3, time

router = APIRouter()

# Store brute-force attempts in-memory
BRUTE_FORCE_ATTEMPTS = {}
LOCKOUT_TIME = 60  # seconds
MAX_ATTEMPTS = 3

@router.post("/login")
async def login(request: Request, username: str = Form(...), password: str = Form(...)):
    client_ip = request.client.host
    key = f"{client_ip}:{username}"
    now = time.time()

    # Brute-force check
    if key in BRUTE_FORCE_ATTEMPTS:
        attempts, last_time = BRUTE_FORCE_ATTEMPTS[key]
        if attempts >= MAX_ATTEMPTS and now - last_time < LOCKOUT_TIME:
            log_request(request, f"LOCKED_OUT username={username}")
            return JSONResponse(status_code=403, content={"error": "Account temporarily locked."})

    conn = sqlite3.connect("honeypot.db")
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM users WHERE username=? AND password=?", (username, password))
        result = cursor.fetchone()
        if result:
            log_request(request, f"LOGIN username={username}, password={password}")
            BRUTE_FORCE_ATTEMPTS.pop(key, None)
            return {"message": "Login success", "user": result}
        else:
            if key not in BRUTE_FORCE_ATTEMPTS:
                BRUTE_FORCE_ATTEMPTS[key] = [1, now]
            else:
                BRUTE_FORCE_ATTEMPTS[key][0] += 1
                BRUTE_FORCE_ATTEMPTS[key][1] = now
            log_request(request, f"FAILED_LOGIN username={username}")
            return {"message": "Invalid credentials"}
    except Exception as e:
        return {"error": str(e)}
