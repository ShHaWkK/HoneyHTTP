from fastapi import APIRouter, Form, Request
import sqlite3
from utils import log_request

router = APIRouter()

@router.post("/login")
async def login(request: Request, username: str = Form(...), password: str = Form(...)):
    log_request(request, f"LOGIN username={username}, password={password}")
    conn = sqlite3.connect("honeypot.db")
    cursor = conn.cursor()
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    try:
        cursor.execute(query)
        result = cursor.fetchone()
    except Exception as e:
        return {"error": str(e)}

    return {"message": "Login success" if result else "Invalid credentials", "user": result}
