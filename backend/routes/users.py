
from fastapi import APIRouter, Request, Header, Form
from utils import log_request
from datetime import datetime

router = APIRouter()

FAKE_USERS = [
    {"id": 1, "username": "admin", "email": "admin@securepanel.io", "password": "admin123", "role": "admin", "lastLogin": "2025-04-10 12:32"},
    {"id": 2, "username": "sysadmin", "email": "sysadmin@corp.io", "password": "toor", "role": "superuser", "lastLogin": "2025-04-10 09:12"},
    {"id": 3, "username": "devops1", "email": "devops@cloud.io", "password": "cloud123", "role": "devops", "lastLogin": "2025-04-08 17:00"},
    {"id": 4, "username": "monitoring", "email": "monitor@tool.io", "password": "zabbixpass", "role": "observer", "lastLogin": "2025-04-05 08:30"},
    {"id": 5, "username": "vpnuser", "email": "vpn@remote.io", "password": "vpn123", "role": "user", "lastLogin": "2025-03-25 22:00"}
]

@router.get("/users")
async def list_users(request: Request, filter: str = "", x_custom: str = Header(None)):
    log_request(request, f"/users?filter={filter}&X-Custom={x_custom}")

    if any(u["username"].startswith(filter.lower()) for u in FAKE_USERS):
        return [u for u in FAKE_USERS if u["username"].startswith(filter.lower())]

    if x_custom and "token" in x_custom.lower():
        return FAKE_USERS

    return {"error": "No users matched."}