import json
import os

SCORES_FILE = "adaptive_learning/model_scores.json"

DEFAULT_SCORES = {
    "translation": {
        "marian": 1.0,
        "gemini": 1.0,
        "groq": 1.0
    },
    "sentiment": {
        "xlm_roberta": 1.0,
        "gemini": 1.0,
        "groq": 1.0
    }
}

def load_scores(user_id):
    try:
        with open(SCORES_FILE, "r") as f:
            all_scores = json.load(f)
        return all_scores.get(user_id, DEFAULT_SCORES.copy())
    except:
        return DEFAULT_SCORES.copy()

def save_scores(user_id, scores):
    os.makedirs("adaptive_learning", exist_ok=True)
    try:
        try:
            with open(SCORES_FILE, "r") as f:
                all_scores = json.load(f)
        except:
            all_scores = {}
        all_scores[user_id] = scores
        with open(SCORES_FILE, "w") as f:
            json.dump(all_scores, f, indent=2)
    except:
        pass

def penalize_model(user_id, task, model_name):
    scores = load_scores(user_id)
    if model_name in scores[task]:
        scores[task][model_name] = max(0.1, scores[task][model_name] - 0.2)
    save_scores(user_id, scores)

def get_model_priority(user_id, task):
    scores = load_scores(user_id)
    return sorted(scores[task].items(), key=lambda x: x[1], reverse=True)