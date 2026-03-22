import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "your_password_here")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "aethrix")

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

def get_connection():
    return engine.connect()

def init_db():
    with engine.connect() as conn:
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS feedback (
                id INT AUTO_INCREMENT PRIMARY KEY,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                user_id VARCHAR(255),
                text TEXT,
                prediction VARCHAR(100),
                feedback VARCHAR(20),
                feedback_type VARCHAR(20),
                model_used VARCHAR(50)
            )
        """))

        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                user_id VARCHAR(255),
                text TEXT,
                language VARCHAR(50),
                translated_text TEXT,
                prediction VARCHAR(100),
                confidence FLOAT
            )
        """))

        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS model_scores (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id VARCHAR(255),
                task VARCHAR(50),
                model_name VARCHAR(50),
                score FLOAT DEFAULT 1.0,
                UNIQUE KEY unique_user_task_model (user_id, task, model_name)
            )
        """))

        conn.commit()