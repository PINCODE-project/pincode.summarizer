import os
import uuid
import requests
import asyncio
import torchaudio
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pyannote.audio import Pipeline
from pyannote_whisper.utils import diarize_text
from dotenv import load_dotenv
from typing import List, Dict
import time
import logging
from concurrent.futures import ThreadPoolExecutor
import subprocess
import torch
from pydub import AudioSegment
import math

# Настройка приложения
UPLOAD_FOLDER = 'uploads'
app = FastAPI()
load_dotenv()
ai_api_url = os.getenv('AI_API_URL')
use_auth_token = os.getenv('USE_AUTH_TOKEN')
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
MAX_FILE_SIZE_MB = 24.99

# Разрешить CORS для всех источников
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Инициализация модели для диаризации речи
pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization-3.1", use_auth_token=use_auth_token)
# Переключение на GPU, если доступно
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
pipeline.to(device)
logger.info(f"Using device: {device}")

# Функция для суммаризации текста с использованием API
def summarize_text_with_api(text: str, parts: List[str]) -> str:
    parts_text = '\n- '.join(parts)
    body = {
        "messages": [
            {
                "role": "system",
                "content": f"Ты суммаризируешь и структурируешь созвоны, которые были транскрибированы в текст. "
                           f"Выводишь подробную информацию, не теряешь сути и не придумываешь лишнего. "
                           f"Отдельно выдели: {parts_text}\n"
                           f"Обязательно 'SPEAKER_XX' замени на те роли, которые ты определишь "
                           f"Обязательно отвечай только на русском языке. "
                           f"Ответ выдай в формате маркдаун"
            },
            {
                "role": "user",
                "content": text
            }
        ]
    }
    response = requests.post(f"{ai_api_url}/ask", json=body)
    if response.status_code == 200:
        return response.json()['response']
    else:
        response.raise_for_status()


# Функция для транскрибации аудио с использованием API
def transcribe_text_with_api(file_path: str, start_time) -> Dict:
    with open(file_path, 'rb') as file:
        files = {'file': (file_path.split('/')[-1], file)}
        response = requests.post(f"{ai_api_url}/transcriptions", files=files)
        logger.info(f"{time.time() - start_time:.2f} sec: Transcription completed in groq func")
        if response.status_code == 200:
            return response.json()
        else:
            return response.raise_for_status()


def split_audio(file_path, chunk_size_mb):
    audio = AudioSegment.from_file(file_path)
    chunk_duration_ms = (chunk_size_mb * 1024 * 1024) / (len(audio.raw_data) / len(audio))

    chunks = []
    for i in range(0, len(audio), int(chunk_duration_ms)):
        chunk = audio[i:i + int(chunk_duration_ms)]
        chunks.append(chunk)

    return chunks


def process_audio_file(file_path, start_time, executor):
    file_size = os.path.getsize(file_path) / (1024 * 1024)
    futures = []
    if file_size >= MAX_FILE_SIZE_MB:
        logger.info(f'Audio file is larger than {MAX_FILE_SIZE_MB} MB, splitting...')
        chunks = split_audio(file_path, MAX_FILE_SIZE_MB)
        for i, chunk in enumerate(chunks):
            chunk_file_path = f"{file_path}_chunk_{i}.mp3"
            chunk.export(chunk_file_path, format="mp3")
            logger.info(f"Processing chunk {i + 1}/{len(chunks)}: {chunk_file_path}")
            futures.append(executor.submit(transcribe_text_with_api, chunk_file_path, start_time))
            logger.info(f"{time.time() - start_time:.2f} sec: Transcription task for chunk {i + 1} started")
    else:
        logger.info(f'Audio transcribing on groq whisper')
        futures.append(executor.submit(transcribe_text_with_api, file_path, start_time))
        logger.info(f"{time.time() - start_time:.2f} sec: Transcription task started")
    return futures

def resample_audio(file_path, new_sample_rate):
    new_wav_path = f"{os.path.splitext(file_path)[0]}.wav"
    # Ресэмплинг и конвертация в WAV с использованием ffmpeg
    command = [
        'ffmpeg',
        '-i', file_path,
        '-ar', str(new_sample_rate),
        '-ac', '2',
        new_wav_path
    ]
    subprocess.run(command)
    os.remove(file_path)
    return new_wav_path


# Эндпоинт для транскрибации аудио
@app.post("/transcribe")
async def transcribe(audio: UploadFile = File(...)):
    executor = ThreadPoolExecutor(max_workers=4)
    start_time = time.time()
    logger.info(f"{0} sec: Start processing request")

    id = str(uuid.uuid4())
    extension = audio.filename.split('.')[-1]
    file_name = f'{id}.{extension}'
    save_path = os.path.join(UPLOAD_FOLDER, file_name)

    # Сохранение аудиофайла
    with open(save_path, 'wb') as f:
        f.write(await audio.read())
    logger.info(f"{time.time() - start_time:.2f} sec: Audio file saved as {save_path}")

    # Преобразование аудио в WAV и изменение сэмпл рейта
    save_path = resample_audio(save_path, new_sample_rate=16000)
    logger.info(f'Resampling audio completed in func, save: {save_path}')

    # Отправка аудио в функцию для деления и отправки в groq
    futures = process_audio_file(save_path, start_time, executor)

    # Загружаем аудио
    waveform, sample_rate = torchaudio.load(save_path)
    logger.info(f"{time.time() - start_time:.2f} sec: Audio open - sample_rate: {sample_rate}")
    # Диаризация аудио
    diarization_result = pipeline({"waveform": waveform, "sample_rate": sample_rate})
    logger.info(f"{time.time() - start_time:.2f} sec: Diarization completed")

    asr_result = {}
    prev_id, prev_start, prev_end = 0, 0.0, 0.0
    # Ожидаем завершения транскрибирования
    for future in futures:
        try:
            chunk = future.result()
            temp_segments = []
            segments = chunk['segments']
            for segment in segments:
                segment['id'] += prev_id
                segment['start'] += prev_start
                segment['end'] += prev_end
                temp_segments.append(segment)
            chunk['segments'] = temp_segments
            prev_chunk = temp_segments[-1]
            prev_id = prev_chunk['id']
            prev_start = prev_chunk['start']
            prev_end = prev_chunk['end']
            if not asr_result:
                asr_result = chunk
            else:
                asr_result['segments'] = asr_result['segments'] + chunk['segments']
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    logger.info(f"{time.time() - start_time:.2f} sec: Transcription completed")

    final_result = diarize_text(asr_result, diarization_result)
    logger.info(f"{time.time() - start_time:.2f} sec: Diarization text processed")

    # Удаляем сохранённый аудиофайл
    os.remove(save_path)
    # Формирование массива с объектами для ответа
    dialog = [{"speaker": spk, "message": sent.strip()} for seg, spk, sent in final_result]
    logger.info(f"{time.time() - start_time:.2f} sec: Response prepared")
    return JSONResponse(content=dialog)


# Эндпоинт для суммаризации диалога
@app.post("/summarize")
def summarize(data: Dict):
    text = data.get('text')
    text_string = '\n'.join([f"{s['speaker']}: {s['message']}" for s in text])
    parts = data.get('parts', ["Участники", "Основные темы диалога", "Заметки", "Договоренности и задачи",
                               "Краткое содержание беседы"])
    summarized_text = summarize_text_with_api(text_string, parts)

    return JSONResponse(content={"summarized_text": summarized_text})


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=5000)
