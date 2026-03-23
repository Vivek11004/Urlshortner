FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app source
COPY ./app .

# Don't run as root
RUN adduser --disabled-password --gecos "" appuser
USER appuser

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "app.app:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
