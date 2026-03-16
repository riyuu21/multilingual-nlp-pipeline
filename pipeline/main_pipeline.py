from routers.language_router import detect_language
from routers.translation_router import translate_text
from routers.model_router import classify_text
from preprocessing.text_preprocess import preprocess_text


def run_pipeline(text, target_lang="en"):

    # Step 1 — Language Detection
    language, confidence = detect_language(text)

    # Step 2 — Translation
    translated_text = translate_text(text, language, target_lang)

    # Step 3 — Preprocessing
    clean_text = preprocess_text(translated_text)

    # Step 4 — Classification
    label, score = classify_text(clean_text)

    results = {
        "original_text": text,
        "language": language,
        "translation": translated_text,
        "prediction": label,
        "confidence": score
    }

    return results


if __name__ == "__main__":

    sample_text = "यह बहुत अच्छा है"

    result = run_pipeline(sample_text)

    print("\n--- Multilingual NLP Pipeline ---\n")

    for key, value in result.items():
        print(f"{key}: {value}")