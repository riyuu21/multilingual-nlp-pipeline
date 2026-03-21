from transformers import pipeline
from configs.config_loader import load_config
from adaptive_learning.local_learning import get_user_corrections, find_correction

classifier = None

def load_classifier():
    global classifier
    if classifier is None:
        config = load_config()
        model_type = config["classification"]["default"]

        if model_type == "xlm_roberta":
            classifier = pipeline(
                "sentiment-analysis",
                model="cardiffnlp/twitter-xlm-roberta-base-sentiment"
            )
        else:
            raise ValueError("Unsupported classification model")

    return classifier

def classify_text(text, user_id=None):
    model = load_classifier()
    result = model(text)[0]
    label = result["label"]
    score = float(result["score"])

    if user_id:
        corrections = get_user_corrections(user_id, "sentiment")
        wrong_prediction = find_correction(text, corrections)
        if wrong_prediction and label == wrong_prediction:
            label = "POSITIVE" if label == "NEGATIVE" else "NEGATIVE"
            score = 0.70

    return label, score