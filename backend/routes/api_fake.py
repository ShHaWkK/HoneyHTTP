from fastapi import APIRouter, Request, Header, Form
from utils import log_request

router = APIRouter()

FAKE_USERS = [
   {"id": 1, "username": "emily1", "email": "emily1@mail.com", "password": "kvij34k9jd", "role": "moderator", "lastLogin": "2025-04-04 21:44:02"},
    {"id": 2, "username": "jane2", "email": "jane2@honeypot.local", "password": "9srfjqjwbe", "role": "editor", "lastLogin": "2025-02-20 21:44:02"},
    {"id": 3, "username": "paul3", "email": "paul3@target.org", "password": "6rm62liuao", "role": "admin", "lastLogin": "2025-03-25 21:44:02"},
    {"id": 4, "username": "nathan4", "email": "nathan4@target.org", "password": "i298bnny2r", "role": "viewer", "lastLogin": "2025-03-27 21:44:02"},
    {"id": 5, "username": "bob5", "email": "bob5@fakecorp.dev", "password": "bmc7amyrxz", "role": "editor", "lastLogin": "2025-03-12 21:44:02"},
    {"id": 6, "username": "alice6", "email": "alice6@domain.com", "password": "password123", "role": "viewer", "lastLogin": "2025-03-15 10:00:00"},
    {"id": 7, "username": "charlie7", "email": "charlie7@domain.com", "password": "securepass", "role": "moderator", "lastLogin": "2025-03-16 11:00:00"},
    {"id": 8, "username": "david8", "email": "david8@domain.com", "password": "mypassword", "role": "editor", "lastLogin": "2025-03-17 12:00:00"},
    {"id": 9, "username": "eve9", "email": "eve9@domain.com", "password": "passw0rd", "role": "admin", "lastLogin": "2025-03-18 13:00:00"},
    {"id": 10, "username": "frank10", "email": "frank10@domain.com", "password": "letmein", "role": "viewer", "lastLogin": "2025-03-19 14:00:00"},
    {"id": 11, "username": "grace11", "email": "grace11@domain.com", "password": "123456", "role": "moderator", "lastLogin": "2025-03-20 15:00:00"},
    {"id": 12, "username": "hank12", "email": "hank12@domain.com", "password": "qwerty", "role": "editor", "lastLogin": "2025-03-21 16:00:00"},
    {"id": 13, "username": "irene13", "email": "irene13@domain.com", "password": "abc123", "role": "admin", "lastLogin": "2025-03-22 17:00:00"},
    {"id": 14, "username": "jack14", "email": "jack14@domain.com", "password": "password1", "role": "viewer", "lastLogin": "2025-03-23 18:00:00"},
    {"id": 15, "username": "karen15", "email": "karen15@domain.com", "password": "iloveyou", "role": "moderator", "lastLogin": "2025-03-24 19:00:00"},
    {"id": 16, "username": "leo16", "email": "leo16@domain.com", "password": "admin123", "role": "editor", "lastLogin": "2025-03-25 20:00:00"},
    {"id": 17, "username": "mia17", "email": "mia17@domain.com", "password": "welcome", "role": "admin", "lastLogin": "2025-03-26 21:00:00"},
    {"id": 18, "username": "nick18", "email": "nick18@domain.com", "password": "hunter2", "role": "viewer", "lastLogin": "2025-03-27 22:00:00"},
    {"id": 19, "username": "olivia19", "email": "olivia19@domain.com", "password": "sunshine", "role": "moderator", "lastLogin": "2025-03-28 23:00:00"},
    {"id": 20, "username": "peter20", "email": "peter20@domain.com", "password": "password!", "role": "editor", "lastLogin": "2025-03-29 00:00:00"},
    {"id": 21, "username": "quinn21", "email": "quinn21@domain.com", "password": "123qwe", "role": "admin", "lastLogin": "2025-03-30 01:00:00"},
    {"id": 22, "username": "rachel22", "email": "rachel22@domain.com", "password": "letmein123", "role": "viewer", "lastLogin": "2025-03-31 02:00:00"},
    {"id": 23, "username": "sam23", "email": "sam23@domain.com", "password": "password2", "role": "moderator", "lastLogin": "2025-04-01 03:00:00"},
    {"id": 24, "username": "tina24", "email": "tina24@domain.com", "password": "myp@ssword", "role": "editor", "lastLogin": "2025-04-02 04:00:00"},
    {"id": 25, "username": "uma25", "email": "uma25@domain.com", "password": "secure123", "role": "admin", "lastLogin": "2025-04-03 05:00:00"},
    {"id": 26, "username": "victor26", "email": "victor26@domain.com", "password": "pass1234", "role": "viewer", "lastLogin": "2025-04-04 06:00:00"},
    {"id": 27, "username": "wendy27", "email": "wendy27@domain.com", "password": "123abc", "role": "moderator", "lastLogin": "2025-04-05 07:00:00"},
    {"id": 28, "username": "xander28", "email": "xander28@domain.com", "password": "passwordx", "role": "editor", "lastLogin": "2025-04-06 08:00:00"},
    {"id": 29, "username": "yara29", "email": "yara29@domain.com", "password": "passw0rd!", "role": "admin", "lastLogin": "2025-04-07 09:00:00"},
    {"id": 30, "username": "zack30", "email": "zack30@domain.com", "password": "zackpass", "role": "viewer", "lastLogin": "2025-04-08 10:00:00"}
]


@router.get("/users")
async def list_users(request: Request, filter: str = "", x_custom: str = Header(None)):
    log_request(request, f"/users?filter={filter}&X-Custom={x_custom}")
    
    if ";" in filter or "1=1" in filter or "--" in filter:
        return {"error": "SQL error near '1=1'"}

    if any(u["username"].startswith(filter.lower()) for u in FAKE_USERS):
        return [u for u in FAKE_USERS if u["username"].startswith(filter.lower())]
    
    if x_custom and "token" in x_custom.lower():
        return FAKE_USERS
    
    return {"error": "No users matched."}


@router.post("/admin/create")
async def create_admin(request: Request, username: str = Form(...), password: str = Form(...)):
    log_request(request, f"POST /admin/create user={username}, pass={password}")
    if "drop" in username.lower() or ";" in password:
        return {"status": "error", "message": "SQL error: syntax near ';'"}
    return {"status": "created", "user": username}

@router.get("/ping")
async def ping():
    return {"status": "pong"}
@router.get("/search")
async def search_q(request: Request, q: str = ""):
    log_request(request, f"SEARCH - query={q}")
    if "<script>" in q:
        return {"error": "XSS Detected!"}
    return {"results": [f"Result for '{q}'", "Nothing found"]}