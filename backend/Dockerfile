# Étape 1 : Base Python
#FROM python:3.11-slim
FROM python:3.11

# Crée un dossier pour l'app
WORKDIR /app

# Copie uniquement les fichiers nécessaires
COPY requirements.txt ./
#RUN python3 -m pip install --upgrade pip
RUN python3 -m pip install --progress-bar off -r requirements.txt
#RUN pip install --no-cache-dir -r requirements.txt

#  Puis copie le reste de l'app
COPY . .

# Crée les dossiers importants
RUN mkdir -p uploads logs assets

# Expose le port FastAPI
EXPOSE 8081

# Lance FastAPI
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8081", "--reload"]
