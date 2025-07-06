# 📄 backend/routes/upload_profile.py

from fastapi import APIRouter, UploadFile, File, Request
import os
from utils import log_request

router = APIRouter()
UPLOAD_DIR = "uploads/profiles"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/profile/upload")
async def upload_profile(request: Request, file: UploadFile = File(...)):
    log_request(request, f"PROFILE_UPLOAD: {file.filename}")
    path = os.path.join(UPLOAD_DIR, file.filename)
    with open(path, "wb") as f:
        f.write(await file.read())
    return {"message": f"{file.filename} uploaded."}
