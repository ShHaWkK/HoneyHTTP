from fastapi import APIRouter, UploadFile, File, Request
import os
from utils import log_request

router = APIRouter()
UPLOAD_DIR = "uploads/"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(request: Request, file: UploadFile = File(...)):
    log_request(request, f"UPLOAD {file.filename}")
    path = os.path.join(UPLOAD_DIR, file.filename)
    with open(path, "wb") as f:
        f.write(await file.read())
    return {"message": f"Uploaded {file.filename}"}
