from fastapi import APIRouter, Request
from utils import log_request
from fastapi.responses import PlainTextResponse

router = APIRouter()

@router.get("/.env", response_class=PlainTextResponse)
async def leaked_env(request: Request):
    log_request(request, "LEAKED: /.env")
    return """
# Simulated .env file
SECRET_KEY="super-secret-honeykey"
DATABASE_URL="postgres://root:toor@localhost/honeydb"
JWT_SECRET="leaked-jwt-fake"
"""

@router.get("/.git/config", response_class=PlainTextResponse)
async def leaked_git(request: Request):
    log_request(request, "LEAKED: /.git/config")
    return """
[core]
\trepositoryformatversion = 0
\tfilemode = true
\tbare = false
\tlogallrefupdates = true
[remote \"origin\"]
\turl = git@fake-git-server:honey/honeypot.git
\tfetch = +refs/heads/*:refs/remotes/origin/*
"""
@router.get("/backup.zip")
async def get_backup(request: Request):
    log_request(request, "/backup.zip accessed")
    # retourne un vrai faux zip vide si tu veux (crée `assets/backup.zip`)
    return FileResponse("assets/backup.zip", media_type="application/zip")

@router.get("/robots.txt")
async def get_robots(request: Request):
    return PlainTextResponse("User-agent: *\nDisallow: /hidden/flag\n")