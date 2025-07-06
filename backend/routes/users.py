# Ajoutez ceci dans backend/routes/users.py
from fastapi import APIRouter, Request, Query
import sqlite3

router = APIRouter()  # ← CETTE LIGNE MANQUAIT !

from fastapi import HTTPException
from fastapi.responses import JSONResponse

def get_session_user(request: Request):
    """Récupérer l'utilisateur de session depuis les headers et vérifier son rôle dans la DB"""
    username = request.headers.get('X-Username', '')
    
    if not username:
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            username = auth_header[7:]
    
    if username:
        try:
            conn = sqlite3.connect("honeypot.db")
            cursor = conn.cursor()
            cursor.execute("SELECT role FROM users WHERE username = ?", (username,))
            result = cursor.fetchone()
            conn.close()
            
            if result:
                return result[0]
        except Exception:
            pass
    
    return 'guest'

@router.get("/api/users")
async def get_users_real(request: Request, filter: str = Query("")):
    """API pour récupérer la liste des utilisateurs depuis SQLite"""
    session_user = get_session_user(request)
    is_admin = (session_user == 'admin')
    
    try:
        conn = sqlite3.connect("honeypot.db")
        cursor = conn.cursor()
        
        if filter and filter.strip():
            cursor.execute(
                "SELECT id, username, password, role FROM users WHERE username LIKE ? OR CAST(id AS TEXT) LIKE ? ORDER BY id", 
                (f'%{filter.strip()}%', f'%{filter.strip()}%')
            )
        else:
            cursor.execute("SELECT id, username, password, role FROM users ORDER BY id")
        
        users_data = cursor.fetchall()
        conn.close()
        
        users = []
        for user in users_data:
            user_obj = {
                'id': user[0],
                'username': user[1],
                'email': f"{user[1]}@honeypot.local",
                'role': user[3] if len(user) > 3 else 'user',
                'lastLogin': '2025-07-04 12:00:00'
            }
            
            if is_admin:
                user_obj['password'] = user[2]
            
            users.append(user_obj)
        
        return users
        
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/api/auth/check")
async def check_auth_real(request: Request):
    """Vérifier le statut admin de l'utilisateur"""
    session_user = get_session_user(request)
    is_admin = (session_user == 'admin')
    
    return {
        'user': session_user,
        'isAdmin': is_admin
    }
