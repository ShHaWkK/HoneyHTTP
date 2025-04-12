from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from database import init_db
from routes import (
    auth, api_fake, chat, exec, file, leaks, login_jwt, logs, monitor,
    phish, rce, track, upload, upload_profile, xss, sql_dump, users
)

app = FastAPI(title="HTTP Honeypot")
init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routeurs
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(api_fake.router)
app.include_router(chat.router)
app.include_router(exec.router)
app.include_router(file.router)
app.include_router(leaks.router)
app.include_router(login_jwt.router)
app.include_router(logs.router)
app.include_router(monitor.router)
app.include_router(phish.router)
app.include_router(rce.router)
app.include_router(track.router)
app.include_router(upload.router)
app.include_router(upload_profile.router)
app.include_router(xss.router)
app.include_router(sql_dump.router)

os.makedirs("logs", exist_ok=True)
