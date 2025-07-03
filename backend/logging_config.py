import logging
import json
import os
import sys
from datetime import datetime
from typing import Optional, List
from fastapi import Request

class DockerJSONFormatter(logging.Formatter):
    """Formatter JSON optimisé pour Docker et ELK"""
    
    def format(self, record):
        log_entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
            # Métadonnées Docker/Honeypot
            "honeypot_name": os.getenv("HONEYPOT_NAME", "HoneyHTTP"),
            "honeypot_host": os.getenv("HONEYPOT_HOST", "unknown"),
            "container_service": "backend",
            "log_source": "docker_stdout"
        }
        
        # Ajout des champs spécifiques au honeypot si présents
        honeypot_fields = [
            'source_ip', 'method', 'url', 'user_agent', 'status_code',
            'attack_indicators', 'threat_score', 'attack_type', 'payload',
            'response_time', 'request_size', 'response_size', 'pattern',
            'error', 'event', 'version'
        ]
        
        for field in honeypot_fields:
            if hasattr(record, field):
                log_entry[field] = getattr(record, field)
        
        return json.dumps(log_entry, ensure_ascii=False)

def setup_honeypot_logging():
    """Configure le système de logging pour Docker"""
    
    # Vérifier si on doit logger vers stdout (mode Docker)
    log_to_stdout = os.getenv("LOG_TO_STDOUT", "false").lower() == "true"
    
    if log_to_stdout:
        return setup_docker_logging()
    else:
        return setup_file_logging()

def setup_docker_logging():
    """Configuration spécifique pour Docker (stdout/stderr)"""
    
    # Logger principal pour stdout
    logger = logging.getLogger("honeypot")
    logger.setLevel(logging.INFO)
    
    # Éviter la duplication des handlers
    if logger.handlers:
        logger.handlers.clear()
    
    # Handler pour stdout avec format JSON
    stdout_handler = logging.StreamHandler(sys.stdout)
    stdout_handler.setFormatter(DockerJSONFormatter())
    stdout_handler.setLevel(logging.INFO)
    logger.addHandler(stdout_handler)
    
    # Logger spécialisé pour les attaques (stderr pour différenciation)
    attack_logger = logging.getLogger("honeypot.attacks")
    attack_logger.setLevel(logging.WARNING)
    
    # Éviter la duplication
    if attack_logger.handlers:
        attack_logger.handlers.clear()
    
    stderr_handler = logging.StreamHandler(sys.stderr)
    stderr_handler.setFormatter(DockerJSONFormatter())
    stderr_handler.setLevel(logging.WARNING)
    attack_logger.addHandler(stderr_handler)
    
    # Logger pour les événements critiques
    critical_logger = logging.getLogger("honeypot.critical")
    critical_logger.setLevel(logging.CRITICAL)
    critical_handler = logging.StreamHandler(sys.stderr)
    critical_handler.setFormatter(DockerJSONFormatter())
    critical_logger.addHandler(critical_handler)
    
    return logger

def setup_file_logging():
    """Configuration pour les fichiers (mode développement)"""
    
    # Créer le dossier logs s'il n'existe pas
    log_dir = os.path.join(os.path.dirname(__file__), "logs")
    os.makedirs(log_dir, exist_ok=True)
    
    # Configuration du logger principal
    logger = logging.getLogger("honeypot")
    logger.setLevel(logging.INFO)
    
    # Éviter la duplication des handlers
    if logger.handlers:
        logger.handlers.clear()
    
    # Handler pour les logs généraux
    general_handler = logging.FileHandler(
        os.path.join(log_dir, "honeypot_access.log"),
        encoding='utf-8'
    )
    general_handler.setFormatter(DockerJSONFormatter())
    logger.addHandler(general_handler)
    
    # Handler pour les attaques
    attack_handler = logging.FileHandler(
        os.path.join(log_dir, "honeypot_attacks.log"),
        encoding='utf-8'
    )
    attack_handler.setFormatter(DockerJSONFormatter())
    attack_handler.setLevel(logging.WARNING)
    
    # Logger spécialisé pour les attaques
    attack_logger = logging.getLogger("honeypot.attacks")
    attack_logger.addHandler(attack_handler)
    attack_logger.setLevel(logging.WARNING)
    
    return logger

def analyze_request_for_attacks(request: Request, body: bytes = None) -> dict:
    """Analyse une requête pour détecter des patterns d'attaque"""
    
    attack_indicators = []
    threat_score = 0
    attack_types = []
    
    # Récupération des données de la requête
    url_path = str(request.url.path)
    query_params = str(request.url.query) if request.url.query else ""
    user_agent = request.headers.get("user-agent", "").lower()
    
    # Combinaison de tout le contenu à analyser
    content_to_analyze = f"{url_path} {query_params}".lower()
    if body:
        try:
            content_to_analyze += " " + body.decode('utf-8', errors='ignore').lower()
        except:
            pass
    
    # === DÉTECTION SQL INJECTION ===
    sql_patterns = [
        r"union\s+select", r"'\s+or\s+'?1'?\s*=\s*'?1", r";drop\s+table",
        r"exec\s*\(", r"insert\s+into", r"delete\s+from", r"update\s+.*set",
        r"'\s+or\s+1=1", r"'\s+union\s+", r"'\s+and\s+1=1", r"0x[0-9a-f]+",
        r"char\s*\(\s*\d+\s*\)", r"ascii\s*\(", r"substring\s*\("
    ]
    
    import re
    for pattern in sql_patterns:
        if re.search(pattern, content_to_analyze):
            attack_indicators.append(f"sql_pattern")
            threat_score += 25
            if "SQL_Injection" not in attack_types:
                attack_types.append("SQL_Injection")
    
    # === DÉTECTION XSS ===
    xss_patterns = [
        r"<script[^>]*>", r"javascript:", r"onload\s*=", r"onerror\s*=",
        r"alert\s*\(", r"prompt\s*\(", r"confirm\s*\(", r"document\.cookie",
        r"<img[^>]*onerror", r"<svg[^>]*onload", r"eval\s*\("
    ]
    
    for pattern in xss_patterns:
        if re.search(pattern, content_to_analyze):
            attack_indicators.append(f"xss_pattern")
            threat_score += 20
            if "XSS" not in attack_types:
                attack_types.append("XSS")
    
    # === DÉTECTION COMMAND INJECTION ===
    cmd_patterns = [
        r";(cat|ls|pwd|whoami|id)\s", r"\|\s*(cat|ls|pwd)", r"`.*`",
        r"\$\(.*\)", r"/bin/(sh|bash)", r"wget\s+http", r"curl\s+",
        r"nc\s+-", r"telnet\s+", r"ssh\s+", r"/etc/passwd", r"cmd\.exe"
    ]
    
    for pattern in cmd_patterns:
        if re.search(pattern, content_to_analyze):
            attack_indicators.append(f"cmd_pattern")
            threat_score += 30
            if "Command_Injection" not in attack_types:
                attack_types.append("Command_Injection")
    
    # === DÉTECTION DIRECTORY TRAVERSAL ===
    if re.search(r"\.\./|\.\.\\|/etc/|/proc/|c:\\windows", content_to_analyze):
        attack_indicators.append("directory_traversal")
        threat_score += 20
        attack_types.append("Directory_Traversal")
    
    # === DÉTECTION BOTS/SCANNERS ===
    scanner_agents = [
        "sqlmap", "nikto", "nmap", "masscan", "acunetix", "nessus",
        "openvas", "burp", "zaproxy", "w3af", "dirb", "gobuster"
    ]
    
    for scanner in scanner_agents:
        if scanner in user_agent:
            attack_indicators.append(f"scanner_{scanner}")
            threat_score += 15
            attack_types.append("Automated_Scanner")
    
    # === ADMIN PANEL HUNTING ===
    admin_patterns = [
        "/admin", "/administrator", "/wp-admin", "/phpmyadmin",
        "/cpanel", "/webmin", "/manager", "/dashboard"
    ]
    
    for pattern in admin_patterns:
        if pattern in url_path:
            attack_indicators.append("admin_hunting")
            threat_score += 10
            if "Reconnaissance" not in attack_types:
                attack_types.append("Reconnaissance")
    
    return {
        "attack_indicators": attack_indicators,
        "threat_score": threat_score,
        "attack_types": attack_types,
        "is_suspicious": len(attack_indicators) > 0
    }

def log_request(request: Request, response_code: int, response_time: float = None, body: bytes = None):
    """Log une requête avec analyse d'attaque"""
    
    logger = logging.getLogger("honeypot")
    attack_logger = logging.getLogger("honeypot.attacks")
    
    # Analyse de la requête
    analysis = analyze_request_for_attacks(request, body)
    
    # Informations de base
    log_data = {
        'source_ip': request.client.host,
        'method': request.method,
        'url': str(request.url),
        'user_agent': request.headers.get('user-agent', ''),
        'status_code': response_code,
        'attack_indicators': analysis['attack_indicators'],
        'threat_score': analysis['threat_score'],
        'attack_type': ', '.join(analysis['attack_types']) if analysis['attack_types'] else None
    }
    
    if response_time:
        log_data['response_time'] = round(response_time * 1000, 2)  # En millisecondes
    
    if body:
        log_data['request_size'] = len(body)
        # Garder un échantillon du payload pour analyse
        if analysis['is_suspicious']:
            log_data['payload'] = body.decode('utf-8', errors='ignore')[:500]
    
    # Log général (stdout)
    logger.info("HTTP Request", extra=log_data)
    
    # Log spécialisé pour les attaques (stderr)
    if analysis['is_suspicious']:
        attack_logger.warning("Potential attack detected", extra=log_data)
        
        # Log critique pour les menaces élevées
        if analysis['threat_score'] >= 75:
            critical_logger = logging.getLogger("honeypot.critical")
            critical_logger.critical("HIGH THREAT DETECTED", extra=log_data)
    
    return analysis
