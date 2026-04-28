FROM python:3.12-slim

WORKDIR /app

COPY backend/python/requirements.txt /app/backend/python/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/python/requirements.txt

COPY backend/python /app/backend/python
COPY frontend /app/frontend
COPY backend/node/data /app/backend/data

EXPOSE 3000

CMD ["uvicorn", "backend.python.app.main:app", "--host", "0.0.0.0", "--port", "3000"]
