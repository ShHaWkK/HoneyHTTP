#ath  backend/routes/exec.py

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import datetime
import os

router = APIRouter()

# Simulated fake flags

FAKE_FLAGS = {
    "/root/flag.txt": "flag{you_thought_this_was_real_lol}",
    "/var/www/html/flag.php": "flag{wp_admin_exposed_backup}",
    "/.env": "APP_SECRET=flag{env_stolen_fake}"
}

@router.get("/")
async def exec_cmd(request: Request, cmd: str = ""):
    client_ip = request.client.host
    user_agent = request.headers.get("user-agent", "Unknown")
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    log_line = f"[{timestamp}] IP={client_ip} | UA={user_agent} | CMD='{cmd}'\n"

    # Logging global
    os.makedirs("logs", exist_ok=True)
    with open("logs/exec.log", "a") as f:
        f.write(log_line)

    # Command simulation
    cmd_lower = cmd.lower()

    # Danger: rm -rf /
    if "rm -rf /" in cmd_lower:
        with open("logs/intrusion_alerts.log", "a") as f:
            f.write(f"[ALERT] Attempted deletion by {client_ip} - CMD: {cmd}\n")
        return JSONResponse({"result": "🔥 SYSTEM ERROR: unauthorized access attempt detected!"}, status_code=403)

    # Danger: .env access
    if "cat /.env" in cmd_lower or cmd_lower.strip() in ["cat /.env", "cat .env"]:
        with open("logs/intrusion_alerts.log", "a") as f:
            f.write(f"[ALERT] ENV file requested by {client_ip} - CMD: {cmd}\n")
        return {"result": "APP_SECRET=flag{env_stolen_fake}"}

    # Flags visibles
    for path, fake_flag in FAKE_FLAGS.items():
        if path in cmd_lower:
            return {"result": fake_flag}

    # Simuler des réponses classiques
    if cmd_lower.startswith("ls"):
        return {"result": "index.php  config.yaml  secrets.env  wp-config.php"}
    elif cmd_lower.startswith("cd"):
        return {"result": f"Changed to {cmd.split(' ')[1]}"}
    elif cmd_lower.startswith("cat"):
        return {"result": "Nothing to display. File not found or empty."}
    elif cmd_lower.startswith("whoami"):
        return {"result": "root"}
    elif cmd_lower.startswith("ifconfig") or "ip a" in cmd_lower:
        return {"result": "eth0: inet 192.168.1.10  netmask 255.255.255.0"}
    elif cmd_lower.startswith("uname"):
        return {"result": "Linux UB 5.4.0-42-generic #46-Ubuntu SMP Mon Oct 12 20:00:00 UTC 2020 x86_64 x86_64 x86_64 GNU/Linux"}
    elif cmd_lower.startswith("ping"):
        return {"result": "PING"}
    elif cmd_lower.startswith("curl"):
        return {"result": "curl: (7) Failed to connect to serverHTTP port 80: Connection refused"}
    return {"result": f"Command '{cmd}' not found"}
