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
from pydub import AudioSegment
from concurrent.futures import ThreadPoolExecutor
import subprocess

# Настройка приложения
UPLOAD_FOLDER = 'uploads'
app = FastAPI()
load_dotenv()
ai_api_url = os.getenv('AI_API_URL')
use_auth_token = os.getenv('USE_AUTH_TOKEN')
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Разрешить CORS для всех источников
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Инициализация модели для диаризации речи
pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization-3.0", use_auth_token=use_auth_token)


def resample_audio(file_path, new_sample_rate):
    new_wav_path = f"{os.path.splitext(file_path)[0]}.wav"
    # Ресэмплинг и конвертация WAV в MP3 с использованием ffmpeg
    command = [
        'ffmpeg',
        '-i', file_path,
        '-ar', str(new_sample_rate),
        '-ac', '2',
        new_wav_path
    ]
    subprocess.run(command)
    return new_wav_path


def convert_to_mp3(file_path):
    # Получаем имя файла без расширения и его расширение
    file_name, file_extension = os.path.splitext(file_path)
    logger.info(f"file_name: {file_name}, file_extension: {file_extension}")
    # Задаем выходной путь для MP3 файла
    output_file_path = f"{file_name}.mp3"
    logger.info(f"output_file_path: {output_file_path}")
    # Загружаем аудиофайл
    audio = AudioSegment.from_file(file_path, format=file_extension[1:])
    # Экспортируем аудиофайл в формат MP3
    audio.export(output_file_path, format="mp3")

    logger.info(f"File saved to {output_file_path}")
    os.remove(file_path)

    return output_file_path


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
        logger.info(f"{time.time() - start_time:.2f} sec: Transcription completed in func")
        if response.status_code == 200:
            return response.json()
        else:
            response.raise_for_status()


# Эндпоинт для транскрибации аудио
@app.post("/transcribe")
async def transcribe(audio: UploadFile = File(...)):
    executor = ThreadPoolExecutor(max_workers=1)
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

    wav_path = resample_audio(save_path, new_sample_rate=4000)
    logger.info(f'Resampling audio completed in func, save: {save_path}')

    # Преобразование любого аудио файла в mp3
    if extension != 'mp3':
        save_path = convert_to_mp3(save_path)

    # Запускаем асинхронную задачу транскрибирования
    future = executor.submit(transcribe_text_with_api, save_path, start_time)
    logger.info(f"{time.time() - start_time:.2f} sec: Transcription task started")

    # Загружаем аудио
    waveform, sample_rate = torchaudio.load(wav_path)
    logger.info(f"{time.time() - start_time:.2f} sec: Audio open - sample_rate: {sample_rate}")
    diarization_result = pipeline({"waveform": waveform, "sample_rate": sample_rate})
    #diarization_result = pipeline(wav_path)
    logger.info(f"{time.time() - start_time:.2f} sec: Diarization completed")

    # Ожидаем завершения транскрибирования
    try:
        asr_result = future.result()
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
