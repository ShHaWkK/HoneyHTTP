from fastapi import APIRouter, Request, Query
from utils import log_request

router = APIRouter()

FAKE_DUMP = """-- SQL Dump from honeypot.cloud
-- Generated: 2025-04-12 13:37

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT,
    password TEXT
);

INSERT INTO users (id, username, password) VALUES (1, 'admin', 'admin123');
INSERT INTO users (id, username, password) VALUES (2, 'sysadmin', 'toor');
INSERT INTO users (id, username, password) VALUES (3, 'devops1', 'cloud123');
INSERT INTO users (id, username, password) VALUES (4, 'monitoring', 'zabbixpass');

-- Honeypot flag:
-- flag{sql_injection_trap_activated}
-- End of dump
"""

@router.get("/dump")
async def dump(request: Request, filter: str = Query("")):
    log_request(request, f"DUMP filter={filter}")
    if "1=1" in filter or "admin" in filter:
        return {"dump": FAKE_DUMP}
    return {"dump": "-- No results for filter"}
