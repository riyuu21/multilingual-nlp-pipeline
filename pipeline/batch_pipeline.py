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

    for index, row in df.iterrows():

        text = row["text"]
        true_label = row["label"]

        # language detection
        language, _ = detect_language(text)

        # translation
        translated_text = translate_text(text, language, "en")

        # preprocessing
        clean_text = preprocess_text(translated_text)

        # classification
        pred_label, score = classify_text(clean_text)

        predictions.append(pred_label)
        true_labels.append(true_label)

        rows.append({
            "text": text,
            "language": language,
            "translated_text": translated_text,
            "prediction": pred_label,
            "confidence": score
        })

    results_df = pd.DataFrame(rows)

    os.makedirs("results", exist_ok=True)
    results_df.to_csv(RESULT_PATH, index=False)

    return true_labels, predictions


if __name__ == "__main__":

    dataset = "data/sample_dataset.csv"

    y_true, y_pred = run_batch_pipeline(dataset)

    results = evaluate_model(y_true, y_pred)

    print("\n--- Evaluation Results ---\n")

    for metric, value in results.items():
        print(metric, ":", value)

    print("\nPredictions saved to results/predictions.csv")
    
