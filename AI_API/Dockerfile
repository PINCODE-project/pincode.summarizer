FROM python:3.12-slim

RUN apt-get update && \
    apt-get install -y \
    build-essential \
    cmake \
    gcc \
    g++ \
    ffmpeg && \
    apt-get clean

# Создаем рабочую директорию
WORKDIR /app

# Копируем файл с зависимостями
COPY requirements.txt .

# Устанавливаем зависимости Python
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходный код приложения в контейнер
COPY . .

RUN mkdir uploads

EXPOSE 5021

# Определяем команду для запуска приложения
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000", "--workers", "2"]