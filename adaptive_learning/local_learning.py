import pandas as pd

FEEDBACK_FILE = "adaptive_learning/feedback_data.csv"

def get_user_feedback(user_id, feedback_type=None):
    try:
        df = pd.read_csv(FEEDBACK_FILE)
        df = df[df["user_id"] == user_id]
        if feedback_type:
            df = df[df["feedback_type"] == feedback_type]
        return df[df["feedback"] == "negative"]
    except:
        return None

def get_user_corrections(user_id, feedback_type):
    try:
        df = pd.read_csv(FEEDBACK_FILE)
        df = df[(df["user_id"] == user_id) & (df["feedback_type"] == feedback_type)]
        return df[df["feedback"] == "negative"][["text", "prediction"]].values.tolist()
    except:
        return []

def feedback_summary(user_id=None):
    try:
        df = pd.read_csv(FEEDBACK_FILE)
        if user_id:
            df = df[df["user_id"] == user_id]
        return {
            "total_feedback": len(df),
            "positive": len(df[df["feedback"] == "positive"]),
            "negative": len(df[df["feedback"] == "negative"])
        }
    except:
        return {"error": "No feedback data yet"}