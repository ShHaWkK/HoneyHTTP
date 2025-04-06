from fastapi import FastAPI
from routes import auth, upload, api,track,phish, rce, xss,login_jwt, logs,api_fake,chat,upload_profile,sql_dump
from database import init_db
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="HTTP Honeypot")
init_db()

# Autoriser le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"]
)

# Routers vulnérables
app.include_router(auth.router)
app.include_router(upload.router)
app.include_router(api.router)
app.include_router(rce.router)
app.include_router(xss.router)
app.include_router(logs.router)
app.include_router(api_fake.router)
app.include_router(chat.router)
app.include_router(upload_profile.router)
app.include_router(sql_dump.router)
app.include_router(login_jwt.router)
app.include_router(track.router)
app.include_router(phish.router)
# Créer le dossier de log si manquant
os.makedirs("logs", exist_ok=True)
