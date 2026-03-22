from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

with patch('database.db.init_db'), \
     patch('routers.model_router.load_classifier'), \
     patch('routers.language_router.load_custom_detector'):
    from api.main import app

client = TestClient(app)

def test_home():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "Aethrix API is running"

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_analyze_empty_input():
    response = client.post("/analyze", json={"text": ""})
    assert response.status_code == 200
    assert response.json()["error"] == "Empty input"

def test_analyze_too_long_input():
    response = client.post("/analyze", json={"text": "a" * 501})
    assert response.status_code == 200

def test_feedback_invalid_type():
    response = client.post("/feedback", json={
        "text": "test",
        "prediction": "POSITIVE",
        "feedback": "invalid"
    })
    assert response.status_code == 200
    assert "error" in response.json()

def test_feedback_text_too_long():
    response = client.post("/feedback", json={
        "text": "a" * 501,
        "prediction": "POSITIVE",
        "feedback": "positive"
    })
    assert response.status_code == 200
    assert response.json()["error"] == "Text too long"

def test_history_no_user_id():
    response = client.get("/history")
    assert response.status_code == 200
    assert "error" in response.json()