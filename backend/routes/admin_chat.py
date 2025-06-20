from fastapi import APIRouter, Request
from utils import log_request

router = APIRouter()

ADMIN_MESSAGES = [
    {
        "author": "Alexandre UZAN",
        "message": "Salut Julien, tu peux me rappeler l'adresse IP et le port du serveur SSH?",
    },
    {
        "author": "Julien Khalifa",
        "message": "Bien sûr, il tourne sur 10.0.0.42:2222 avec la clé ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKFAKEKEY123456789",
    },
    {"author": "Alexandre UZAN", "message": "Parfait, merci, je le note."},
]

@router.get("/admin/chat")
async def admin_chat(request: Request):
    log_request(request, "ADMIN_CHAT_VIEW")
    return {"messages": ADMIN_MESSAGES}
