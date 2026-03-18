import pandas as pd

FEEDBACK_FILE = "adaptive_learning/feedback_data.csv"

def get_misclassified_data():
    try:
        df = pd.read_csv(FEEDBACK_FILE)
        return df[df["feedback"] == "negative"]
    except:
        return None

def feedback_summary():
    try:
        df = pd.read_csv(FEEDBACK_FILE)
        return {
            "total_feedback": len(df),
            "positive": len(df[df["feedback"] == "positive"]),
            "negative": len(df[df["feedback"] == "negative"])
        }
    except:
        return {"error": "No feedback data yet"}