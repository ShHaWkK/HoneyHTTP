import datetime

def log_request(request, detail: str):
    with open("logs/http.log", "a") as f:
        f.write(f"[{datetime.datetime.now()}] {request.client.host} - {request.headers.get('user-agent')} - {detail}\n")
