import sqlite3

def init_db():
    conn = sqlite3.connect("honeypot.db")
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT, password TEXT
    )''')
    cursor.execute('''INSERT OR IGNORE INTO users (id, username, password)
                      VALUES (1, 'admin', 'password123')''')
    conn.commit()
    conn.close()
