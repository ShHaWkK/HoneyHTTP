# backend/routes/support.py
from fastapi import APIRouter, Form, UploadFile, File, Request
from fastapi.responses import JSONResponse
from utils import log_request
import os, uuid

router = APIRouter()
TICKET_DIR = "uploads/tickets/"
os.makedirs(TICKET_DIR, exist_ok=True)

@router.post("/support/tickets")
async def create_ticket(
    request: Request,
    name: str = Form(...),
    email: str = Form(...),
    subject: str = Form(...),
    message: str = Form(...),
    
    ):

    # génération d’un ID de ticket
    ticket_id = str(uuid.uuid4())[:8]
    # lire tous les fichiers du form
    files = await request.form()
    saved = []
    for field, file in files.items():
        if isinstance(file, UploadFile):
            fn = f"{ticket_id}_{file.filename}"
            path = os.path.join(TICKET_DIR, fn)
            with open(path, "wb") as f:
                f.write(await file.read())
            saved.append(fn)
    # log complet
    log_request(request, f"[TICKET] id={ticket_id} | name={name} | email={email} | subject={subject} | files={saved}")
    return JSONResponse({"ticket": ticket_id, "files": saved})
