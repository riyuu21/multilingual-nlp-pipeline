from transformers import pipeline
from configs.config_loader import load_config

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


def classify_text(text):

    model = load_classifier()

    result = model(text)[0]

    label = result["label"]
    score = float(result["score"])

    return label, score