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

def get_user_history(user_id, filter_by=None, filter_value=None):
    try:
        rows = []
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row["user_id"] != user_id:
                    continue

                if filter_by and filter_value:
                    try:
                        ts = datetime.fromisoformat(row["timestamp"].split(".")[0])
                        if filter_by == "day" and ts.strftime("%Y-%m-%d") != filter_value:
                            continue
                        if filter_by == "month" and ts.strftime("%Y-%m") != filter_value:
                            continue
                        if filter_by == "year" and ts.strftime("%Y") != filter_value:
                            continue
                    except:
                        continue

                rows.append(row)
        return list(reversed(rows))
    except:
        return []