# 📦 Étape 1 : Base Python
FROM python:3.11-slim

# 📁 Crée un dossier pour l'app
WORKDIR /app

# ✅ Copie uniquement les fichiers nécessaires
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 🔁 Puis copie le reste de l'app
COPY . .

# ✅ Crée les dossiers importants
RUN mkdir -p uploads logs assets

# 🔊 Expose le port FastAPI
EXPOSE 8080

# 🚀 Lance FastAPI
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080", "--reload"]
