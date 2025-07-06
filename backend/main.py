from fastapi import FastAPI, APIRouter, Request, Form, UploadFile, File, Header, Query
from fastapi.responses import PlainTextResponse, JSONResponse, RedirectResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import os, sqlite3, json, base64, time

app = FastAPI(title="HTTP Honeypot")
router = APIRouter()


print("MAIN est uilisé")

# ------------------ Utils ------------------
def log_request(request: Request, detail: str):
    os.makedirs("logs", exist_ok=True)
    with open("logs/http.log", "a") as f:
        f.write(f"[{datetime.now()}] {request.client.host} - {request.headers.get('user-agent')} - {detail}\n")

# ------------------ Init DB ------------------
def init_db():
    conn = sqlite3.connect("honeypot.db")
    cursor = conn.cursor()
    
    # Créer la table avec la colonne role
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'user'
    )''')
    
    # Ajouter la colonne role si elle n'existe pas déjà (pour les bases existantes)
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'")
    except sqlite3.OperationalError:
        pass  # La colonne existe déjà
    
    # Utilisateurs avec leurs rôles
    fake_users = [
        ('admin', 'admin123', 'admin'),
        ('sysadmin', 'toor', 'admin'), 
        ('devops1', 'cloud123', 'user'),
        ('monitoring', 'zabbixpass', 'user'),
        ('backup', 'restoreme', 'user'),
        ('vpnuser', 'vpn123', 'user'),
        ('gitlab-ci', 'runner123', 'user'),
        ('firewall', 'pfSense@2024', 'user'),
        ('support', 'helpdesk42', 'user'),
        ('operator', 'op!234', 'user')
    ]
    
    # Insérer ou ignorer (pour éviter les doublons)
    cursor.executemany("INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)", fake_users)
    
    # Mettre à jour les utilisateurs existants sans rôle
    cursor.execute("UPDATE users SET role = 'admin' WHERE username IN ('admin', 'sysadmin') AND role IS NULL")
    cursor.execute("UPDATE users SET role = 'user' WHERE role IS NULL")
    
    conn.commit()
    conn.close()

# INITIALISER LA BASE DE DONNÉES
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
    time_now = datetime.utcnow().isoformat()
    log_request(request, f"[LOGIN ATTEMPT] {username}:{password} | IP={ip} | UA={ua} | Time={time_now}")
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

CVE_MAP = {
    "cat /.env": "CVE-2023-XXXX – Exfiltration de variables d'environnement",
    "rm -rf /": "CVE-2022-CRITICAL – Commande destructrice",
    "curl http://": "CVE-2021-CALLBACK – External callback",
    "python -c": "CVE-2020-RCE – Remote Code Execution"
}

@router.get("/exec")
async def exec_cmd(request: Request, cmd: str = Query("")):
    log_request(request, f"CMD {cmd}")
    cmd_lower = cmd.lower()
    
    # CVE Detection first
    for pattern, cve in CVE_MAP.items():
        if pattern in cmd_lower:
            log_request(request, f"[CVE_MATCH] {pattern} → {cve}")
            return {"result": f"⚠️ CVE Detected: {cve}"}
    
    # Terminal simulation
    if "rm -rf /" in cmd_lower:
        return JSONResponse({"result": "🔥 SYSTEM ERROR: unauthorized access attempt detected!"}, status_code=403)
    if "cat /.env" in cmd_lower or "cat .env" in cmd_lower:
        return {"result": FAKE_FLAGS["/.env"]}
    
    for path, flag in FAKE_FLAGS.items():
        if path in cmd_lower:
            return {"result": flag}
    
    if cmd_lower.startswith("ls"):
        return {"result": "index.php  config.yaml  secrets.env  wp-config.php"}
    elif cmd_lower.startswith("cd"):
        return {"result": f"Changed to {cmd.split(' ')[1] if len(cmd.split(' ')) > 1 else '/'}"}
    elif cmd_lower.startswith("cat"):
        return {"result": "Nothing to display. File not found or empty."}
    elif cmd_lower.startswith("whoami"):
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

# ------------------ Users API (pour l'interface web) ------------------
def get_session_user(request: Request):
    """Récupérer l'utilisateur de session depuis les headers et vérifier son rôle dans la DB"""
    # Récupérer le nom d'utilisateur depuis les headers
    username = request.headers.get('X-Username', '')
    
    # Fallback : récupérer depuis Authorization Bearer
    if not username:
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            username = auth_header[7:]  # Enlever "Bearer "
    
    # Vérifier dans la base de données
    if username:
        try:
            conn = sqlite3.connect("honeypot.db")
            cursor = conn.cursor()
            cursor.execute("SELECT role FROM users WHERE username = ?", (username,))
            result = cursor.fetchone()
            conn.close()
            
            if result:
                return result[0]  # Retourne 'admin' ou 'user'
        except Exception as e:
            log_request(request, f"AUTH_DB_ERROR: {str(e)}")
    
    return 'guest'  # Utilisateur non authentifié

@router.get("/api/users")
async def get_users(request: Request, filter: str = Query("")):
    """API pour récupérer la liste des utilisateurs (interface web)"""
    session_user = get_session_user(request)
    is_admin = (session_user == 'admin')
    
    log_request(request, f"USERS_API filter='{filter}' role={session_user}")
    
    try:
        conn = sqlite3.connect("honeypot.db")
        cursor = conn.cursor()
        
        # Requête avec filtre optionnel - INCLURE LA COLONNE ROLE
        if filter and filter.strip():
            cursor.execute(
                "SELECT id, username, password, role FROM users WHERE username LIKE ? OR CAST(id AS TEXT) LIKE ? ORDER BY id", 
                (f'%{filter.strip()}%', f'%{filter.strip()}%')
            )
        else:
            cursor.execute("SELECT id, username, password, role FROM users ORDER BY id")
        
        users_data = cursor.fetchall()
        conn.close()
        
        # Formater pour l'interface React
        users = []
        for user in users_data:
            user_obj = {
                'id': user[0],
                'username': user[1],
                'email': f"{user[1]}@honeypot.local",
                'role': user[3] if len(user) > 3 else 'user',  # Utiliser le rôle de la DB
                'lastLogin': '2025-07-04 12:00:00'
            }
            
            # Mots de passe visibles seulement pour les admins
            if is_admin:
                user_obj['password'] = user[2]
                log_request(request, f"ADMIN_PASSWORD_ACCESS user={user[1]}")
            
            users.append(user_obj)
        
        return users
        
    except Exception as e:
        log_request(request, f"USERS_API_ERROR {str(e)}")
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/api/auth/check")
async def check_auth(request: Request):
    """Vérifier le statut admin de l'utilisateur"""
    session_user = get_session_user(request)
    is_admin = (session_user == 'admin')
    
    log_request(request, f"AUTH_CHECK role={session_user} admin={is_admin}")
    
    return {
        'user': session_user,
        'isAdmin': is_admin
    }

@router.get("/api/health")
async def api_health_check(request: Request):
    """Health check de l'API"""
    log_request(request, "API_HEALTH_CHECK")
    
    try:
        conn = sqlite3.connect("honeypot.db")
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        conn.close()
        
        return {
            'status': 'ok',
            'service': 'users-api',
            'database': 'connected',
            'userCount': user_count
        }
    except Exception as e:
        return {
            'status': 'error',
            'service': 'users-api',
            'error': str(e)
        }

# ------------------ Users Stats ------------------
@router.get("/api/users/stats")
async def get_user_stats(request: Request):
    """Statistiques des utilisateurs"""
    log_request(request, "USER_STATS_ACCESS")
    
    try:
        conn = sqlite3.connect("honeypot.db")
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM users")
        total_users = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'admin'")
        admin_count = cursor.fetchone()[0]
        
        conn.close()
        
        return {
            'totalUsers': total_users,
            'adminUsers': admin_count,
            'regularUsers': total_users - admin_count
        }
        
    except Exception as e:
        log_request(request, f"USER_STATS_ERROR {str(e)}")
        return JSONResponse(status_code=500, content={"error": str(e)})

# ------------------ Final Setup ------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
"""
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8081)
"""
