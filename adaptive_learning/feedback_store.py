import csv
import os
from datetime import datetime

FEEDBACK_FILE = "adaptive_learning/feedback_data.csv"

def save_feedback(text, prediction, feedback):
    os.makedirs("adaptive_learning", exist_ok=True)
    
    file_exists = os.path.isfile(FEEDBACK_FILE)
    
    with open(FEEDBACK_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        
        if not file_exists:
            writer.writerow(["timestamp", "text", "prediction", "feedback"])
        
        writer.writerow([datetime.now(), text, prediction, feedback])