from configs.config_loader import load_config
from langdetect import detect
from adaptive_learning.local_learning import get_user_corrections
import fasttext

FASTTEXT_MODEL_PATH = "models/detection/lid.176.bin"

fasttext_model = None

def load_fasttext():
    global fasttext_model
    if fasttext_model is None:
        fasttext_model = fasttext.load_model(FASTTEXT_MODEL_PATH)
    return fasttext_model

def detect_language(text, user_id=None):
    config = load_config()
    model_type = config["language_detection"]["default"]

    try:
        if model_type == "fasttext":
            model = load_fasttext()
            prediction = model.predict(text)
            lang = prediction[0][0].replace("__label__", "")
            confidence = float(prediction[1][0])

        elif model_type == "langdetect":
            lang = detect(text)
            confidence = 0.90

        else:
            raise ValueError("Unsupported language detection model")

    except Exception:
        lang = detect(text)
        confidence = 0.80

    if user_id:
        corrections = get_user_corrections(user_id, "language")
        for corrected_text, wrong_prediction in corrections:
            if corrected_text.strip().lower() == text.strip().lower():
                if lang == wrong_prediction:
                    lang = detect(text)
                    confidence = 0.70

    return lang, confidence