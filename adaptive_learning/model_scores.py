from sqlalchemy import text
from database.db import get_connection

DEFAULT_SCORES = {
    "translation": {"marian": 1.0, "gemini": 1.0, "groq": 1.0},
    "sentiment": {"xlm_roberta": 1.0, "gemini": 1.0, "groq": 1.0}
}

def get_model_priority(user_id, task):
    try:
        with get_connection() as conn:
            result = conn.execute(text("""
                SELECT model_name, score FROM model_scores
                WHERE user_id = :user_id AND task = :task
            """), {"user_id": user_id, "task": task})
            rows = result.fetchall()
            if not rows:
                return list(DEFAULT_SCORES[task].items())
            scores = {row[0]: row[1] for row in rows}
            defaults = DEFAULT_SCORES[task].copy()
            defaults.update(scores)
            return sorted(defaults.items(), key=lambda x: x[1], reverse=True)
    except:
        return list(DEFAULT_SCORES[task].items())

def penalize_model(user_id, task, model_name):
    try:
        with get_connection() as conn:
            conn.execute(text("""
                INSERT INTO model_scores (user_id, task, model_name, score)
                VALUES (:user_id, :task, :model_name, 0.8)
                ON DUPLICATE KEY UPDATE score = GREATEST(0.1, score - 0.2)
            """), {"user_id": user_id, "task": task, "model_name": model_name})
            conn.commit()
    except:
        pass