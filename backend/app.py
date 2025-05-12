from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# DB et init
from database import init_db

from routes import (
    auth,           
    support,        # /support/tickets
    api_fake,       # API trompeuses (filtres users, token API, etc)
    chat,           # /chat /chat/send
    exec,           # faux terminal /exec
    file,           # accès fichiers type /.env, /.git/
    leaks,          # fichiers statiques /backup.zip, /.env, etc
    logs,           # affichage des logs, tokens, tracking
    monitor,        # /analytics, /logs, etc
    phish,          # simulation login OAuth
    rce,            # pièges remote code execution
    track,          # suivi comportemental
    upload,         # téléversement standard
    upload_profile, # upload de profils
    xss,            # formulaire commentaire piégé
    sql_dump,       # simulation SQL dump (ex: admin 1=1)
    users           # liste utilisateurs / admin-create

)

app = FastAPI(title="HTTP Honeypot")

# Initialisation BDD fake
init_db()

# CORS pour accepter les appels du frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],         # à restreindre si besoin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(support.router)
# Montage des routes
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(api_fake.router)
app.include_router(chat.router)
app.include_router(exec.router)
app.include_router(file.router)
app.include_router(leaks.router)
app.include_router(logs.router)
app.include_router(monitor.router)
app.include_router(phish.router)
app.include_router(rce.router)
app.include_router(track.router)
app.include_router(upload.router)
app.include_router(upload_profile.router)
app.include_router(xss.router)
app.include_router(sql_dump.router)
app.include_router(support.router)


# Création dossier logs s’il n’existe pas
os.makedirs("logs", exist_ok=True)
