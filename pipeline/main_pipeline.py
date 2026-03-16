from routers.language_router import detect_language
from routers.translation_router import translate_text
from routers.model_router import classify_text
from preprocessing.text_preprocess import preprocess_text


def run_pipeline(text, target_lang="en"):

    print("\n--- Multilingual NLP Pipeline ---\n")

    # Step 1: Detect language
    language, confidence = detect_language(text)
    print("Detected Language:", language)
    print("Confidence:", confidence)

    # Step 2: Translate
    translated_text = translate_text(text, language, target_lang)
    print("Translated Text:", translated_text)

    # Step 3: Preprocess
    clean_text = preprocess_text(translated_text)

    # Step 4: Classification
    label, score = classify_text(clean_text)

    print("Predicted Label:", label)
    print("Confidence:", score)


if __name__ == "__main__":

    sample_text = "यह बहुत अच्छा है"

    run_pipeline(sample_text)