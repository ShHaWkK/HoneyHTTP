import sqlite3
def init_db():
    conn = sqlite3.connect("honeypot.db")
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT
    )''')
    fake_users = [
        ('admin', 'admin123'),
        ('sysadmin', 'toor'),
        ('devops1', 'cloud123'),
        ('monitoring', 'zabbixpass'),
        ('backup', 'restoreme'),
        ('vpnuser', 'vpn123'),
        ('gitlab-ci', 'runner123'),
        ('firewall', 'pfSense@2024'),
        ('support', 'helpdesk42'),
        ('operator', 'op!234')
    ]
    cursor.executemany("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)", fake_users)
    conn.commit()
    conn.close()
