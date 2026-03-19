import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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

        logging.info(f"Input: {text} | User: {request.user_id}")

        if request.source_lang == "hinglish":
            translated = hinglish_to_english(text)
            clean_text = preprocess_text(translated)
            label, score = classify_text(clean_text, request.user_id)
            return {
                "language": "hinglish",
                "language_confidence": 1.0,
                "translated_text": translated,
                "prediction": label,
                "confidence": score
            }

        if request.source_lang:
            language = request.source_lang
            confidence = 1.0
        else:
            language, confidence = detect_language(text, request.user_id)

        translated = translate_text(text, language, request.target_lang)
        clean_text = preprocess_text(translated)
        label, score = classify_text(clean_text, request.user_id)

        return {
            "language": language,
            "language_confidence": confidence,
            "translated_text": translated,
            "prediction": label,
            "confidence": score
        }

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