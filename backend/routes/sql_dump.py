from fastapi import APIRouter, Request, Query
from utils import log_request

router = APIRouter()

FAKE_DUMP = """
-- Fake SQL Dump
INSERT INTO users (id, username, password) VALUES (1, 'admin', 'hash123');
INSERT INTO users (id, username, password) VALUES (2, 'root', 'rootpass');
"""

@router.get("/dump")
async def dump(request: Request, filter: str = Query("")):
    log_request(request, f"DUMP filter={filter}")
    if "1=1" in filter or "admin" in filter:
        return {"dump": FAKE_DUMP}
    return {"dump": "-- No results for filter"}
