import pandas as pd
import os

from routers.language_router import detect_language
from routers.translation_router import translate_text
from routers.model_router import classify_text
from preprocessing.text_preprocess import preprocess_text
from evaluation.metrics import evaluate_model

RESULT_PATH = "results/predictions.csv"

def run_batch_pipeline(dataset_path):
    df = pd.read_csv(dataset_path)
    predictions = []
    true_labels = []
    rows = []

    for _, row in df.iterrows():
        language, _ = detect_language(row["text"])
        translated_text = translate_text(row["text"], language, "en")
        clean_text = preprocess_text(translated_text)
        pred_label, score = classify_text(clean_text)

        predictions.append(pred_label)
        true_labels.append(row["label"])
        rows.append({
            "text": row["text"],
            "language": language,
            "translated_text": translated_text,
            "prediction": pred_label,
            "confidence": score
        })

    os.makedirs("results", exist_ok=True)
    pd.DataFrame(rows).to_csv(RESULT_PATH, index=False)

    return true_labels, predictions

if __name__ == "__main__":
    y_true, y_pred = run_batch_pipeline("data/sample_dataset.csv")
    results = evaluate_model(y_true, y_pred)
    for metric, value in results.items():
        print(metric, ":", value)
    print("Predictions saved to results/predictions.csv")