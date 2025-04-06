from fastapi import APIRouter, Request
from fastapi.responses import PlainTextResponse
from utils import log_request

router = APIRouter()

@router.get("/file")
async def file_access(request: Request, path: str = ""):
    log_request(request, f"FILE path={path}")
    if ".." in path:
        return PlainTextResponse("root:x:0:0:root:/root:/bin/bash", status_code=200)
    return PlainTextResponse("404 - File Not Found", status_code=404)
