from datetime import datetime
from sqlalchemy import text
from database.db import get_connection

def save_feedback(user_id, text_input, prediction, feedback, feedback_type="sentiment", model_used=None):
    with get_connection() as conn:
        conn.execute(text("""
            INSERT INTO feedback (user_id, text, prediction, feedback, feedback_type, model_used)
            VALUES (:user_id, :text, :prediction, :feedback, :feedback_type, :model_used)
        """), {
            "user_id": user_id,
            "text": text_input,
            "prediction": prediction,
            "feedback": feedback,
            "feedback_type": feedback_type,
            "model_used": model_used
        })
        conn.commit()