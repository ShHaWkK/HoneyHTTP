from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import os
import time
import logging

# DB et init
from database import init_db

# Import du système de logging honeypot
from logging_config import setup_honeypot_logging, log_request

# Routes existantes
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
    admin_chat,     # conversation administrative fictive
    xss,            # formulaire commentaire piégé
    sql_dump,       # simulation SQL dump (ex: admin 1=1)
    users           # liste utilisateurs / admin-create
)

# Configuration du logging au démarrage de l'application
setup_honeypot_logging()

# Création de l'application FastAPI
app = FastAPI(
    title="HoneyHTTP - Honeypot Web Application",
    description="Honeypot HTTP haute interaction pour détecter et analyser les attaques web",
    version="1.0.0"
)

# Initialisation BDD fake
init_db()

# Création dossier logs s'il n'existe pas
os.makedirs("logs", exist_ok=True)

# CORS pour accepter les appels du frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],         # à restreindre si besoin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def honeypot_logging_middleware(request: Request, call_next):
    """
    Middleware principal pour le logging et l'analyse des attaques
    Capture toutes les requêtes et les analyse pour détecter des patterns malveillants
    """
    
    start_time = time.time()
    logger = logging.getLogger("honeypot")
    attack_logger = logging.getLogger("honeypot.attacks")
    
    # Capture du body pour l'analyse (limité pour éviter les problèmes de mémoire)
    body = None
    if request.method in ["POST", "PUT", "PATCH"]:
        try:
            # Limitation à 1MB pour éviter les attaques DoS par gros uploads
            body = await request.body()
            if len(body) > 1024 * 1024:  # 1MB
                body = body[:1024 * 1024]  # Tronquer si trop gros
        except Exception as e:
            logger.warning(f"Erreur lors de la lecture du body: {e}")
            body = None
    
    # Détection préliminaire d'attaques critiques
    url_path = str(request.url.path).lower()
    query_params = str(request.url.query).lower() if request.url.query else ""
    user_agent = request.headers.get("user-agent", "").lower()
    
    # Alertes immédiates pour certains patterns critiques
    critical_patterns = [
        "../../etc/passwd", "/bin/sh", "cmd.exe", "powershell",
        "union select", "drop table", "<script>alert", "javascript:alert"
    ]
    
    for pattern in critical_patterns:
        if pattern in url_path or pattern in query_params:
            attack_logger.critical("CRITICAL ATTACK PATTERN DETECTED", extra={
                'source_ip': request.client.host,
                'pattern': pattern,
                'url': str(request.url),
                'user_agent': request.headers.get('user-agent', ''),
                'attack_type': 'Critical_Pattern_Match',
                'threat_score': 100
            })
            break
    
    # Traitement de la requête
    try:
        response = await call_next(request)
    except Exception as e:
        # Log des erreurs d'application comme potentielles attaques
        attack_logger.error("Application error - potential attack", extra={
            'source_ip': request.client.host,
            'url': str(request.url),
            'error': str(e),
            'attack_type': 'Application_Error',
            'threat_score': 50
        })
        # Re-raise l'exception pour que FastAPI la gère normalement
        raise e
    
    # Calcul du temps de réponse
    process_time = time.time() - start_time
    
    # Log et analyse complète de la requête
    analysis = log_request(
        request=request,
        response_code=response.status_code,
        response_time=process_time,
        body=body
    )
    
    # Ajout d'headers personnalisés (pour identifier le honeypot si nécessaire)
    response.headers["X-Powered-By"] = "Apache/2.4.41"  # Faux header pour tromper
    response.headers["Server"] = "nginx/1.18.0"         # Faux header
    
    # Header honeypot interne (ne pas utiliser en prod)
    if os.getenv("DEBUG", "false").lower() == "true":
        response.headers["X-Honeypot-Analysis"] = f"Score:{analysis.get('threat_score', 0)}"
    
    return response

# === ROUTES PERSONNALISÉES POUR PIÉGER LES ATTAQUES ===

@app.get("/")
async def root():
    """Page d'accueil du honeypot"""
    return {
        "message": "Welcome to SecureApp Dashboard",
        "version": "2.4.1",
        "status": "online"
    }

@app.get("/robots.txt")
async def robots_txt():
    """Fichier robots.txt piégé pour attirer les bots"""
    attack_logger = logging.getLogger("honeypot.attacks")
    attack_logger.info("robots.txt accessed - potential bot", extra={
        'attack_type': 'Bot_Detection',
        'threat_score': 10
    })
    
    return Response(
        content="""User-agent: *
Disallow: /admin/
Disallow: /backup/
Disallow: /config/
Disallow: /.env
Disallow: /database/
Disallow: /private/

# Sensitive areas
Disallow: /api/internal/
Disallow: /logs/
Disallow: /debug/""",
        media_type="text/plain"
    )

@app.get("/.env")
async def fake_env_file():
    """Faux fichier .env pour capturer les tentatives d'accès"""
    attack_logger = logging.getLogger("honeypot.attacks")
    attack_logger.warning("Attempted .env file access", extra={
        'attack_type': 'Sensitive_File_Access',
        'threat_score': 75
    })
    
    return Response(
        content="""# Database Configuration
DB_HOST=localhost
DB_USER=admin
DB_PASS=SuperSecretPassword123
DB_NAME=production_db

# API Keys
API_KEY=sk-1234567890abcdef
SECRET_KEY=your-secret-key-here
JWT_SECRET=jwt-super-secret

# Third Party
STRIPE_KEY=sk_test_1234567890
AWS_ACCESS_KEY=AKIA1234567890
AWS_SECRET=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY""",
        media_type="text/plain"
    )

@app.get("/backup.zip")
async def fake_backup():
    """Faux fichier de backup pour capturer les tentatives de téléchargement"""
    attack_logger = logging.getLogger("honeypot.attacks")
    attack_logger.warning("Attempted backup file download", extra={
        'attack_type': 'Backup_File_Access',
        'threat_score': 80
    })
    
    # Retourner un faux fichier ZIP
    return Response(
        content=b"PK\x03\x04\x14\x00\x00\x00\x08\x00FAKE_ZIP_CONTENT",
        media_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=backup.zip"}
    )

@app.get("/admin")
@app.get("/administrator")
@app.get("/wp-admin")
@app.get("/phpmyadmin")
async def fake_admin_panels():
    """Fausses pages d'administration pour capturer les tentatives d'accès"""
    attack_logger = logging.getLogger("honeypot.attacks")
    attack_logger.warning("Admin panel access attempt", extra={
        'attack_type': 'Admin_Panel_Discovery',
        'threat_score': 60
    })
    
    return {
        "error": "Access Denied",
        "message": "You are not authorized to access this area",
        "code": 403
    }

@app.get("/shell.php")
@app.get("/c99.php")
@app.get("/r57.php")
@app.get("/webshell.php")
async def fake_webshells():
    """Détection de tentatives d'accès à des webshells"""
    attack_logger = logging.getLogger("honeypot.attacks")
    attack_logger.critical("WEBSHELL ACCESS ATTEMPT", extra={
        'attack_type': 'Webshell_Access',
        'threat_score': 100
    })
    
    return Response(
        content="<?php echo 'Shell not found'; ?>",
        media_type="text/plain"
    )

@app.api_route("/api/debug", methods=["GET", "POST"])
async def fake_debug_endpoint(request: Request):
    """Endpoint de debug piégé"""
    attack_logger = logging.getLogger("honeypot.attacks")
    attack_logger.warning("Debug endpoint accessed", extra={
        'attack_type': 'Debug_Endpoint_Access',
        'threat_score': 45
    })
    
    return {
        "debug": False,
        "message": "Debug mode disabled in production"
    }

# === MONTAGE DES ROUTES EXISTANTES ===

# Routes d'authentification
app.include_router(auth.router, prefix="/auth", tags=["authentication"])

# Routes utilisateurs
app.include_router(users.router, prefix="/users", tags=["users"])

# Routes support
app.include_router(support.router, prefix="/support", tags=["support"])

# Routes API trompeuses
app.include_router(api_fake.router, prefix="/api", tags=["api"])

# Routes de chat
app.include_router(chat.router, prefix="/chat", tags=["chat"])

# Routes d'exécution de commandes
app.include_router(exec.router, prefix="/exec", tags=["execution"])

# Routes d'accès aux fichiers
app.include_router(file.router, prefix="/files", tags=["files"])

# Routes de fuites de données
app.include_router(leaks.router, prefix="/leaks", tags=["leaks"])

# Routes de logs
app.include_router(logs.router, prefix="/logs", tags=["logs"])

# Routes de monitoring
app.include_router(monitor.router, prefix="/monitor", tags=["monitoring"])

# Routes de phishing
app.include_router(phish.router, prefix="/oauth", tags=["phishing"])

# Routes RCE
app.include_router(rce.router, prefix="/rce", tags=["rce"])

# Routes de tracking
app.include_router(track.router, prefix="/track", tags=["tracking"])

# Routes d'upload
app.include_router(upload.router, prefix="/upload", tags=["upload"])

# Routes d'upload de profil
app.include_router(upload_profile.router, prefix="/profile", tags=["profile"])

# Routes de chat admin
app.include_router(admin_chat.router, prefix="/admin/chat", tags=["admin"])

# Routes XSS
app.include_router(xss.router, prefix="/comments", tags=["xss"])

# Routes SQL dump
app.include_router(sql_dump.router, prefix="/database", tags=["database"])

# === GESTIONNAIRE D'ERREURS ===

@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    """Gestionnaire personnalisé pour les erreurs 404"""
    attack_logger = logging.getLogger("honeypot.attacks")
    
    # Log des tentatives d'accès à des ressources inexistantes
    attack_logger.info("404 - Resource not found", extra={
        'source_ip': request.client.host,
        'url': str(request.url),
        'user_agent': request.headers.get('user-agent', ''),
        'attack_type': '404_Enumeration',
        'threat_score': 5
    })
    
    return {
        "error": "Not Found",
        "message": "The requested resource was not found",
        "status_code": 404
    }

@app.exception_handler(500)
async def internal_error_handler(request: Request, exc):
    """Gestionnaire pour les erreurs 500 (potentielles attaques)"""
    attack_logger = logging.getLogger("honeypot.attacks")
    
    attack_logger.error("500 - Internal server error", extra={
        'source_ip': request.client.host,
        'url': str(request.url),
        'error': str(exc),
        'attack_type': 'Server_Error',
        'threat_score': 30
    })
    
    return {
        "error": "Internal Server Error",
        "message": "An unexpected error occurred",
        "status_code": 500
    }

# === ÉVÉNEMENTS DE DÉMARRAGE/ARRÊT ===

@app.on_event("startup")
async def startup_event():
    """Événements au démarrage de l'application"""
    logger = logging.getLogger("honeypot")
    logger.info("HoneyHTTP honeypot started", extra={
        'event': 'startup',
        'version': '1.0.0'
    })

@app.on_event("shutdown")
async def shutdown_event():
    """Événements à l'arrêt de l'application"""
    logger = logging.getLogger("honeypot")
    logger.info("HoneyHTTP honeypot stopped", extra={
        'event': 'shutdown'
    })

# Point d'entrée principal
if __name__ == "__main__":
    import uvicorn
    
    # Configuration de démarrage
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000, 
        log_level="info",
        access_log=False  # Désactivé car on utilise notre propre système de logging
    )
