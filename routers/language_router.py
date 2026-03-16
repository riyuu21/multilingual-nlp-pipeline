from configs.config_loader import load_config
from langdetect import detect
import fasttext

FASTTEXT_MODEL_PATH = "models/detection/lid.176.bin"

fasttext_model = None


def load_fasttext():
    global fasttext_model

    if fasttext_model is None:
        fasttext_model = fasttext.load_model(FASTTEXT_MODEL_PATH)

    return fasttext_model


def detect_language(text):

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

        # fallback model
        lang = detect(text)
        confidence = 0.80

    return lang, confidence