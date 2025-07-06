from fastapi import APIRouter, Request
from fastapi.responses import PlainTextResponse
from utils import log_request

router = APIRouter()

@router.get("/file")
async def file(request: Request, path: str = ""):
    log_request(request, f"FILE access path={path}")
    if ".." in path:
        return PlainTextResponse("root:x:0:0:root:/root:/bin/bash", status_code=200)
    return PlainTextResponse("File not found", status_code=404)
