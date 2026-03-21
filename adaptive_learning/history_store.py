import csv
import os
from datetime import datetime

HISTORY_FILE = "adaptive_learning/history_data.csv"

def save_history(user_id, text, language, translated_text, prediction, confidence):
    os.makedirs("adaptive_learning", exist_ok=True)

    file_exists = os.path.isfile(HISTORY_FILE)

    with open(HISTORY_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)

        if not file_exists:
            writer.writerow(["timestamp", "user_id", "text", "language", "translated_text", "prediction", "confidence"])

        writer.writerow([datetime.now(), user_id, text, language, translated_text, prediction, confidence])

def get_user_history(user_id):
    try:
        rows = []
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row["user_id"] == user_id:
                    rows.append(row)
        return list(reversed(rows))
    except:
        return []