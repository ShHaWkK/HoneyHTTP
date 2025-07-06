from fastapi import APIRouter, Request
from fastapi.responses import PlainTextResponse, FileResponse
from utils import log_request

router = APIRouter()

@router.get("/.env", response_class=PlainTextResponse)
async def env(request: Request):
    log_request(request, "LEAKED: /.env")
    return "SECRET_KEY=supersecret\nDB_URL=postgres://user:pass@localhost/db"

@router.get("/.git/config", response_class=PlainTextResponse)
async def git(request: Request):
    log_request(request, "LEAKED: /.git/config")
    return "[remote \"origin\"]\n\turl = git@fake.git/repo.git\n\tfetch = +refs/*:refs/*"

@router.get("/backup.zip")
async def backup(request: Request):
    log_request(request, "/backup.zip accessed")
    return FileResponse("assets/backup.zip", media_type="application/zip")
