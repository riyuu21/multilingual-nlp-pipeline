from deep_translator import GoogleTranslator

HINGLISH_MAP = {
    "kon": "kaun",
    "tum": "tum",
    "kya": "kya",
    "kaise": "kaise",
    "ho": "ho",
    "hai": "hai",
    "acha": "accha",
    "bura": "bura"
}

def normalize_hinglish(text):
    words = text.lower().split()
    return " ".join([HINGLISH_MAP.get(w, w) for w in words])

def hinglish_to_english(text):
    try:
        clean_text = normalize_hinglish(text)
        return GoogleTranslator(source='auto', target='en').translate(clean_text)
    except:
        return text