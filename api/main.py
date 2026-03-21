import logging
import time
from collections import defaultdict
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from adaptive_learning.history_store import save_history, get_user_history
from routers.language_router import detect_language
from routers.translation_router import translate_text
from routers.model_router import classify_text
from preprocessing.text_preprocess import preprocess_text
from preprocessing.hinglish_converter import hinglish_to_english
from adaptive_learning.feedback_store import save_feedback
from adaptive_learning.local_learning import feedback_summary

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# cache — stores results so same text isn't analyzed twice
result_cache = {}
CACHE_MAX_SIZE = 500

# rate limiter — tracks requests per user
rate_limit_store = defaultdict(list)
RATE_LIMIT = 20
RATE_WINDOW = 60

def is_rate_limited(user_id: str) -> bool:
    now = time.time()
    key = user_id or "anonymous"
    requests = rate_limit_store[key]
    requests = [t for t in requests if now - t < RATE_WINDOW]
    rate_limit_store[key] = requests
    if len(requests) >= RATE_LIMIT:
        return True
    rate_limit_store[key].append(now)
    return False

def get_cache_key(text, source_lang, target_lang):
    return f"{text}|{source_lang}|{target_lang}"

def add_to_cache(key, value):
    if len(result_cache) >= CACHE_MAX_SIZE:
        oldest = next(iter(result_cache))
        del result_cache[oldest]
    result_cache[key] = value

class TextRequest(BaseModel):
    text: str
    source_lang: str = None
    target_lang: str = "en"
    user_id: str = None

class FeedbackRequest(BaseModel):
    text: str
    prediction: str
    feedback: str
    feedback_type: str = "sentiment"
    user_id: str = None

@app.get("/")
def home():
    return {"message": "NLP API is running"}

@app.post("/analyze")
def analyze_text(request: TextRequest):
    try:
        text = request.text.strip()

        if not text:
            return {"error": "Empty input"}

        if is_rate_limited(request.user_id):
            return JSONResponse(
                status_code=429,
                content={"error": "Too many requests, please slow down"}
            )

        logging.info(f"Input: {text} | User: {request.user_id}")

        cache_key = get_cache_key(text, request.source_lang, request.target_lang)
        if cache_key in result_cache:
            logging.info("Returning cached result")
            return result_cache[cache_key]

        if request.source_lang == "hinglish":
            translated = hinglish_to_english(text)
            clean_text = preprocess_text(translated)
            label, score = classify_text(clean_text, request.user_id)
            result = {
                "language": "hinglish",
                "language_confidence": 1.0,
                "translated_text": translated,
                "prediction": label,
                "confidence": score
            }
            save_history(request.user_id, text, "hinglish", translated, label, score)
            add_to_cache(cache_key, result)
            return result

        if request.source_lang:
            language = request.source_lang
            confidence = 1.0
        else:
            language, confidence = detect_language(text, request.user_id)

        translated = translate_text(text, language, request.target_lang)
        clean_text = preprocess_text(translated)
        label, score = classify_text(clean_text, request.user_id)

        result = {
            "language": language,
            "language_confidence": confidence,
            "translated_text": translated,
            "prediction": label,
            "confidence": score
        }
        save_history(request.user_id, text, language, translated, label, score)
        add_to_cache(cache_key, result)
        return result

    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return {"error": str(e)}

@app.post("/feedback")
def submit_feedback(request: FeedbackRequest):
    try:
        if request.feedback not in ["positive", "negative"]:
            return {"error": "Invalid feedback type"}

        if request.feedback_type not in ["sentiment", "language"]:
            return {"error": "Invalid feedback type"}

        save_feedback(request.user_id, request.text, request.prediction, request.feedback, request.feedback_type)
        return {"message": "Feedback saved"}

    except Exception as e:
        logging.error(f"Feedback error: {str(e)}")
        return {"error": str(e)}

@app.get("/feedback-summary")
def get_feedback_summary(user_id: str = None):
    return feedback_summary(user_id)
@app.get("/history")
def get_history(user_id: str = None, filter_by: str = None, filter_value: str = None):
    if not user_id:
        return {"error": "user_id required"}
    return get_user_history(user_id, filter_by, filter_value)