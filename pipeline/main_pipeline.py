from routers.language_router import detect_language
from routers.translation_router import translate_text
from routers.model_router import classify_text
from preprocessing.text_preprocess import preprocess_text

def run_pipeline(text, target_lang="en"):
    language, confidence = detect_language(text)
    translated_text = translate_text(text, language, target_lang)
    clean_text = preprocess_text(translated_text)
    label, score = classify_text(clean_text)

    return {
        "original_text": text,
        "language": language,
        "translation": translated_text,
        "prediction": label,
        "confidence": score
    }

if __name__ == "__main__":
    result = run_pipeline("यह बहुत अच्छा है")
    for key, value in result.items():
        print(f"{key}: {value}")