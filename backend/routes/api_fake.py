from fastapi import APIRouter, Request, Header, Form
from utils import log_request

router = APIRouter()

FAKE_USERS = [
    {"id": 1, "username": "admin", "email": "admin@target.com"},
    {"id": 2, "username": "john", "email": "john@domain.com"},
    {"id": 3, "username": "root", "email": "root@root.local"},
]

@router.get("/users")
async def list_users(request: Request, filter: str = "", x_custom: str = Header(None)):
    log_request(request, f"/users?filter={filter}&X-Custom={x_custom}")
    if "admin" in filter.lower() or (x_custom and "token" in x_custom.lower()):
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
