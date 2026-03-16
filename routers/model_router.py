from transformers import pipeline

classifier = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-xlm-roberta-base-sentiment"
)


def classify_text(text):

    result = classifier(text)

    label = result[0]["label"]
    score = result[0]["score"]

    return label, score