FROM python:3.11
WORKDIR /app
COPY . .
RUN pip install fastapi uvicorn python-multipart
EXPOSE 8080
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]
