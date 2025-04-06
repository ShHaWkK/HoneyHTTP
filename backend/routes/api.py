from fastapi import APIRouter, Request, Query
from utils import log_request

router = APIRouter()

@router.get("/data")
async def get_data(request: Request, token: str = Query(...)):
    log_request(request, f"API token={token}")
    if token == "abc123-secret":
        return {"data": "Sensitive API Data"}
    return {"error": "Invalid token"}
