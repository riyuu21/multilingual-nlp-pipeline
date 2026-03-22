import json
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from configs.config_loader import load_config
from langdetect import detect
from adaptive_learning.local_learning import get_user_corrections, find_correction

MODEL_PATH = "models/detection/aethrix_lang_detector"

tokenizer = None
model = None
id2label = None

def load_custom_detector():
    global tokenizer, model, id2label

    if model is not None:
        return tokenizer, model, id2label

    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
    model.eval()

    with open(f"{MODEL_PATH}/label_map.json", "r") as f:
        label_map = json.load(f)
    id2label = {int(k): v for k, v in label_map["id2label"].items()}

    return tokenizer, model, id2label

def detect_with_custom_model(text):
    tok, mod, labels = load_custom_detector()

    inputs = tok(text, return_tensors="pt", truncation=True, padding="max_length", max_length=128)

    with torch.no_grad():
        outputs = mod(**inputs)

    probs = torch.softmax(outputs.logits, dim=-1)
    confidence, predicted = torch.max(probs, dim=-1)

    lang = labels[predicted.item()]
    score = confidence.item()

    return lang, score

def detect_language(text, user_id=None):
    try:
        lang, confidence = detect_with_custom_model(text)
    except Exception:
        try:
            lang = detect(text)
            confidence = 0.80
        except:
            lang = "en"
            confidence = 0.5

    if user_id:
        corrections = get_user_corrections(user_id, "language")
        wrong_prediction = find_correction(text, corrections)
        if wrong_prediction and lang == wrong_prediction:
            try:
                lang = detect(text)
                confidence = 0.70
            except:
                pass

    return lang, confidence