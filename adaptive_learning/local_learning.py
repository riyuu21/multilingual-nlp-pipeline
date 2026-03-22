from sqlalchemy import text
from database.db import get_connection
from thefuzz import fuzz

SIMILARITY_THRESHOLD = 80

def is_similar(text1, text2):
    return fuzz.ratio(text1.lower().strip(), text2.lower().strip()) >= SIMILARITY_THRESHOLD

def get_user_corrections(user_id, feedback_type):
    try:
        with get_connection() as conn:
            result = conn.execute(text("""
                SELECT text, prediction FROM feedback
                WHERE user_id = :user_id
                AND feedback_type = :feedback_type
                AND feedback = 'negative'
            """), {"user_id": user_id, "feedback_type": feedback_type})
            return [(row[0], row[1]) for row in result]
    except:
        return []

def find_correction(text, corrections):
    for corrected_text, wrong_prediction in corrections:
        if is_similar(text, corrected_text):
            return wrong_prediction
    return None

def feedback_summary(user_id=None):
    try:
        with get_connection() as conn:
            if user_id:
                result = conn.execute(text("""
                    SELECT
                        COUNT(*) as total,
                        SUM(CASE WHEN feedback = 'positive' THEN 1 ELSE 0 END) as positive,
                        SUM(CASE WHEN feedback = 'negative' THEN 1 ELSE 0 END) as negative
                    FROM feedback WHERE user_id = :user_id
                """), {"user_id": user_id})
            else:
                result = conn.execute(text("""
                    SELECT
                        COUNT(*) as total,
                        SUM(CASE WHEN feedback = 'positive' THEN 1 ELSE 0 END) as positive,
                        SUM(CASE WHEN feedback = 'negative' THEN 1 ELSE 0 END) as negative
                    FROM feedback
                """))
            row = result.fetchone()
            return {
                "total_feedback": row[0] or 0,
                "positive": row[1] or 0,
                "negative": row[2] or 0
            }
    except:
        return {"error": "No feedback data yet"}