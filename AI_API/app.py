from flask import Flask, request, jsonify
from pyannote.audio import Pipeline
from pyannote_whisper.utils import diarize_text
from werkzeug.utils import secure_filename
from flask_cors import cross_origin
from dotenv import load_dotenv
import os
import requests
import uuid


# Настройка приложения
UPLOAD_FOLDER = 'uploads'
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
load_dotenv()
ai_api_url = os.getenv('AI_API_URL')
use_auth_token = os.getenv('USE_AUTH_TOKEN')

# Инициализация модели для диаризации речи
pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization-3.0", use_auth_token=use_auth_token)


# Функция для суммаризации текста с использованием API
def summarize_text_with_api(text, parts):
    parts_text = '\n- '.join(parts)
    body = {"messages":
                [{"role": "system",
                  "content": f"Ты суммаризируешь и структурируешь созвоны, которые были транскрибированы в текст. "
                             f"Выводишь подробную информацию, не теряешь сути и не придумываешь лишнего. "
                             f"Отдельно выдели: {parts_text}\n"
                             f"Обязательно 'SPEAKER_XX' замени на те роли, которые ты определишь "
                             f"Обязательно отвечай только на русском языке. "
                             f"Ответ выдай в формате маркдаун"},
                {"role": "user",
                "content": text}]}
    response = requests.post(f"{ai_api_url}/ask", json = body)
    if response.status_code == 200:
        return response.json()['response']
    else:
        response.raise_for_status()


# Функция для транскрибации аудио с использованием API
def transcribe_text_with_api(file_path):
    with open(file_path, 'rb') as file:
        files = {'file': (file_path.split('/')[-1], file)}
        print(file_path)
        response = requests.post(f"{ai_api_url}/transcriptions", files=files)

        if response.status_code == 200:
            return response.json()
        else:
            response.raise_for_status()


# Эндпоинт для транскрибации аудио
@app.route('/transcribe', methods=['POST'])
@cross_origin()
def transcribe():
    audio_file = request.files['audio']     # Получение аудиофайла из запроса
    id = str(uuid.uuid4())     # Генерация уникального идентификатора для файла
    extension = secure_filename(audio_file.filename).split('.')[1]     # Получение расширения файла
    file_name = f'{id}.{extension}'    # Формирование пути для сохранения файла
    save_path = os.path.join(app.config['UPLOAD_FOLDER'], file_name)    # Сохранение аудиофайла
    audio_file.save(save_path)    # Сохранение аудиофайла
    asr_result = transcribe_text_with_api(save_path)    # Транскрибирование аудио в текст с помощью внешнего API
    diarization_result = pipeline(save_path)    # Диаризация аудио (определение спикеров)
    os.remove(save_path)    # Удаление сохраненного аудиофайла
    final_result = diarize_text(asr_result, diarization_result)    # Объединение диаризации аудио с текстом аудио

    # Формирование массива с объектами для ответа
    dialog = []
    for seg, spk, sent in final_result:
        dialog.append({"speaker": spk, "message": sent.strip()})

    return jsonify(dialog)


# Эндпоинт для суммаризации диалога
@app.route('/summarize', methods=['POST'])
@cross_origin()
def summarize():
    data = request.json
    text = data.get('text')
    text_string = '\n'.join([f"{s['speaker']}: {s['message']}" for s in text])     # Объединение диаризации аудио с текстом аудио
    # Получение частей для суммаризации, либо присваивание дефолтных
    parts = data.get('parts', ["Участники", "Основные темы диалога", "Заметки", "Договоренности и задачи", "Краткое содержание беседы"])

    summarized_text = summarize_text_with_api(text_string, parts)

    return jsonify({"summarized_text": summarized_text})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000)
