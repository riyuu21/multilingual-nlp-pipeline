from evaluation.metrics import evaluate_model

def test_perfect_predictions():
    y_true = ["positive", "negative", "neutral"]
    y_pred = ["positive", "negative", "neutral"]
    results = evaluate_model(y_true, y_pred)
    assert results["accuracy"] == 1.0
    assert results["f1_score"] == 1.0

def test_wrong_predictions():
    y_true = ["positive", "positive", "positive"]
    y_pred = ["negative", "negative", "negative"]
    results = evaluate_model(y_true, y_pred)
    assert results["accuracy"] == 0.0

def test_partial_predictions():
    y_true = ["positive", "negative", "positive", "negative"]
    y_pred = ["positive", "positive", "positive", "negative"]
    results = evaluate_model(y_true, y_pred)
    assert results["accuracy"] == 0.75