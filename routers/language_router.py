import fasttext

# Load model once
model = fasttext.load_model("models/detection/lid.176.bin")


def detect_language(text):

    prediction = model.predict(text)

    lang = prediction[0][0].replace("__label__", "")
    confidence = prediction[1][0]

    return lang, confidence