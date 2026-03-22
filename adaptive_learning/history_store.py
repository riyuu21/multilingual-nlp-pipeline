from sqlalchemy import text
from database.db import get_connection

def save_history(user_id, text_input, language, translated_text, prediction, confidence):
    try:
        with get_connection() as conn:
            conn.execute(text("""
                INSERT INTO history (user_id, text, language, translated_text, prediction, confidence)
                VALUES (:user_id, :text, :language, :translated_text, :prediction, :confidence)
            """), {
                "user_id": user_id,
                "text": text_input,
                "language": language,
                "translated_text": translated_text,
                "prediction": prediction,
                "confidence": confidence
            })
            conn.commit()
    except:
        pass

def get_user_history(user_id, filter_by=None, filter_value=None):
    try:
        with get_connection() as conn:
            query = "SELECT * FROM history WHERE user_id = :user_id"
            params = {"user_id": user_id}

            if filter_by == "day" and filter_value:
                query += " AND DATE(timestamp) = :filter_value"
                params["filter_value"] = filter_value
            elif filter_by == "month" and filter_value:
                query += " AND DATE_FORMAT(timestamp, '%Y-%m') = :filter_value"
                params["filter_value"] = filter_value
            elif filter_by == "year" and filter_value:
                query += " AND YEAR(timestamp) = :filter_value"
                params["filter_value"] = filter_value

            query += " ORDER BY timestamp DESC"

            result = conn.execute(text(query), params)
            rows = result.fetchall()
            keys = result.keys()
            return [dict(zip(keys, row)) for row in rows]
    except:
        return []