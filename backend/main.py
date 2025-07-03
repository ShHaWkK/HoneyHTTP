from fastapi import FastAPI, APIRouter, Request, Form, UploadFile, File, Header, Query
from fastapi.responses import PlainTextResponse, JSONResponse, RedirectResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import os, sqlite3, json, base64, time

app = FastAPI(title="HTTP Honeypot")
router = APIRouter()

# ------------------ Utils ------------------

def log_request(request: Request, detail: str):
    os.makedirs("logs", exist_ok=True)
    with open("logs/http.log", "a") as f:
        f.write(f"[{datetime.now()}] {request.client.host} - {request.headers.get('user-agent')} - {detail}\n")

# ------------------ Init DB ------------------

def init_db():
    conn = sqlite3.connect("honeypot.db")
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT
    )''')
    fake_users = [
        ('admin', 'admin123'), ('sysadmin', 'toor'), ('devops1', 'cloud123'),
        ('monitoring', 'zabbixpass'), ('backup', 'restoreme'),
        ('vpnuser', 'vpn123'), ('gitlab-ci', 'runner123'),
        ('firewall', 'pfSense@2024'), ('support', 'helpdesk42'), ('operator', 'op!234')
    ]
    cursor.executemany("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)", fake_users)
    conn.commit()
    conn.close()

init_db()

# ------------------ Tracking ------------------

@router.post("/track")
async def track(request: Request):
    data = await request.json()
    data["ip"] = request.client.host
    data["user_agent"] = request.headers.get("User-Agent", "Unknown")
    data["time"] = datetime.utcnow().isoformat()
    log_request(request, f"[TRACK] {data}")
    return {"status": "logged"}

@router.post("/track/creds")
async def capture_creds(username: str = Form(...), password: str = Form(...), request: Request = None):
    ip = request.client.host
    ua = request.headers.get("User-Agent", "Unknown")
    time = datetime.utcnow().isoformat()
    log_request(request, f"[LOGIN ATTEMPT] {username}:{password} | IP={ip} | UA={ua} | Time={time}")
    return {"user": username if username == "admin" and password == "admin123" else None, "message": "Connexion simulée"}

# ------------------ JWT ------------------

def fake_jwt(username):
    h = base64.urlsafe_b64encode(json.dumps({"alg": "HS256"}).encode()).decode().rstrip("=")
    p = base64.urlsafe_b64encode(json.dumps({"sub": username, "role": "admin"}).encode()).decode().rstrip("=")
    return f"{h}.{p}.insecure_signature"

@router.post("/login-jwt")
async def login_jwt(request: Request, username: str = Form(...), password: str = Form(...)):
    log_request(request, f"JWT_LOGIN username={username}, password={password}")
    return JSONResponse(content={"message": "Login OK", "token": fake_jwt(username)})

# ------------------ Classic Login ------------------

BRUTE_FORCE_ATTEMPTS = {}
LOCKOUT_TIME = 60
MAX_ATTEMPTS = 3

@router.post("/login")
async def login(request: Request, username: str = Form(...), password: str = Form(...)):
    client_ip = request.client.host
    key = f"{client_ip}:{username}"
    now = time.time()

    if key in BRUTE_FORCE_ATTEMPTS and BRUTE_FORCE_ATTEMPTS[key][0] >= MAX_ATTEMPTS and now - BRUTE_FORCE_ATTEMPTS[key][1] < LOCKOUT_TIME:
        log_request(request, f"LOCKED_OUT username={username}")
        return JSONResponse(status_code=403, content={"error": "Account temporarily locked."})

    conn = sqlite3.connect("honeypot.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username=? AND password=?", (username, password))
    result = cursor.fetchone()

    if result:
        log_request(request, f"LOGIN username={username}, password={password}")
        BRUTE_FORCE_ATTEMPTS.pop(key, None)
        return {"message": "Login success", "user": result}
    else:
        BRUTE_FORCE_ATTEMPTS[key] = [BRUTE_FORCE_ATTEMPTS.get(key, [0, now])[0] + 1, now]
        log_request(request, f"FAILED_LOGIN username={username}")
        return {"message": "Invalid credentials"}

# ------------------ Terminal Simulation ------------------

FAKE_FLAGS = {
    "/root/flag.txt": "flag{you_thought_this_was_real_lol}",
    "/var/www/html/flag.php": "flag{wp_admin_exposed_backup}",
    "/.env": "APP_SECRET=flag{env_stolen_fake}"
}

@router.get("/exec")
async def exec_cmd(request: Request, cmd: str = ""):
    log_request(request, f"CMD {cmd}")
    cmd = cmd.lower()

    if "rm -rf /" in cmd:
        return JSONResponse({"result": "🔥 SYSTEM ERROR: unauthorized access attempt detected!"}, status_code=403)
    if "cat /.env" in cmd or "cat .env" in cmd:
        return {"result": FAKE_FLAGS["/.env"]}
    for path, flag in FAKE_FLAGS.items():
        if path in cmd:
            return {"result": flag}
    if cmd.startswith("ls"):
        return {"result": "index.php  config.yaml  secrets.env  wp-config.php"}
    elif cmd.startswith("cd"):
        return {"result": f"Changed to {cmd.split(' ')[1]}"}
    elif cmd.startswith("cat"):
        return {"result": "Nothing to display. File not found or empty."}
    elif cmd.startswith("whoami"):
        return {"result": "root"}
    return {"result": f"Command '{cmd}' not found"}

# ------------------ Uploads ------------------

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(f"{UPLOAD_DIR}/profiles", exist_ok=True)

@router.post("/upload")
async def upload_file(request: Request, file: UploadFile = File(...)):
    log_request(request, f"UPLOAD {file.filename}")
    path = os.path.join(UPLOAD_DIR, file.filename)
    with open(path, "wb") as f:
        f.write(await file.read())
    return {"message": f"Uploaded {file.filename}"}

@router.post("/profile/upload")
async def upload_profile(request: Request, file: UploadFile = File(...)):
    log_request(request, f"PROFILE_UPLOAD: {file.filename}")
    path = os.path.join(UPLOAD_DIR, "profiles", file.filename)
    with open(path, "wb") as f:
        f.write(await file.read())
    return {"message": f"{file.filename} uploaded."}

# ------------------ Comments / XSS ------------------

XSS_MESSAGES = []

@router.post("/comment")
async def comment(request: Request, message: str = Form(...)):
    log_request(request, f"XSS comment={message}")
    XSS_MESSAGES.append(message)
    return {"status": "ok"}

@router.get("/comments")
async def get_comments():
    return {"comments": XSS_MESSAGES}

# ------------------ Chat ------------------

CHAT_MESSAGES = []

@router.get("/chat")
async def get_messages():
    return {"messages": CHAT_MESSAGES}

@router.post("/chat/send")
async def send_message(request: Request, username: str = Form(...), message: str = Form(...)):
    log_request(request, f"CHAT {username}: {message}")
    CHAT_MESSAGES.append(f"<b>{username}</b>: {message}")
    return {"status": "sent"}

# ------------------ Static Leaks ------------------

@router.get("/.env", response_class=PlainTextResponse)
async def leak_env(request: Request):
    log_request(request, "LEAKED: /.env")
    return "SECRET_KEY=supersecret\nDB_URL=postgres://user:pass@localhost/db"

@router.get("/.git/config", response_class=PlainTextResponse)
async def leak_git(request: Request):
    log_request(request, "LEAKED: /.git/config")
    return "[remote \"origin\"]\n\turl = git@fake.git/repo.git"

@router.get("/backup.zip")
async def backup(request: Request):
    log_request(request, "/backup.zip accessed")
    return FileResponse("assets/backup.zip", media_type="application/zip")

# ------------------ SQL Dump ------------------

@router.get("/dump")
async def dump(request: Request, filter: str = Query("")):
    log_request(request, f"DUMP filter={filter}")
    if "1=1" in filter or "admin" in filter:
        return {"dump": "-- SQL DUMP with users and flag{sql_injection_trap_activated}"}
    return {"dump": "-- No results"}

# ------------------ Tracking Visualisation ------------------

@router.get("/tokens", response_class=PlainTextResponse)
def show_tokens():
    try:
        with open("logs/http.log", "r") as f:
            return "\n".join([line for line in f if "JWT_LOGIN" in line]) or "No tokens found."
    except:
        return "Log not found."

@router.get("/trackings", response_class=PlainTextResponse)
def show_tracking():
    try:
        with open("logs/http.log", "r") as f:
            return "\n".join([line for line in f if "TRACK" in line]) or "No user behavior recorded."
    except:
        return "Tracking data missing."
    

# ------------------ CVE Simulation ------------------

CVE_MAP = {
    "cat /.env": "CVE-2023-XXXX – Exfiltration de variables d’environnement",
    "rm -rf /": "CVE-2022-CRITICAL – Commande destructrice",
    "curl http://": "CVE-2021-CALLBACK – External callback",
    "python -c": "CVE-2020-RCE – Remote Code Execution"
}

@router.get("/exec")
async def exec_cmd(request: Request, cmd: str = Query("")):
    log_request(request, f"CMD {cmd}")
    for pattern, cve in CVE_MAP.items():
        if pattern in cmd:
            log_request(request, f"[CVE_MATCH] {pattern} → {cve}")
            return {"result": f"⚠️ CVE Detected: {cve}"}
    ...


# ------------------ Final Setup ------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
