import csv
import os
from datetime import datetime

FEEDBACK_FILE = "adaptive_learning/feedback_data.csv"

def save_feedback(user_id, text, prediction, feedback, feedback_type="sentiment"):
    os.makedirs("adaptive_learning", exist_ok=True)

    file_exists = os.path.isfile(FEEDBACK_FILE)

    with open(FEEDBACK_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)

        if not file_exists:
            writer.writerow(["timestamp", "user_id", "text", "prediction", "feedback", "feedback_type"])

        writer.writerow([datetime.now(), user_id, text, prediction, feedback, feedback_type])