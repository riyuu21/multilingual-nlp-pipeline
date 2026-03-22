import concurrent.futures
from collections import Counter

from routers.translation_router import translate_text as marian_translate
from routers.model_router import classify_text as xlm_sentiment
from routers.gemini_router import gemini_translate, gemini_sentiment
from routers.groq_router import groq_translate, groq_sentiment
from adaptive_learning.model_scores import get_model_priority

def majority_vote(results):
    valid = [r for r in results if r is not None]
    if not valid:
        return None
    count = Counter(valid)
    return count.most_common(1)[0][0]

def ensemble_translate(text, source_lang, target_lang="en", user_id=None):
    priority = get_model_priority(user_id, "translation") if user_id else [
        ("marian", 1.0), ("gemini", 1.0), ("groq", 1.0)
    ]

    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = {
            "marian": executor.submit(marian_translate, text, source_lang, target_lang),
            "gemini": executor.submit(gemini_translate, text, source_lang, target_lang),
            "groq": executor.submit(groq_translate, text, source_lang, target_lang),
        }
        results = {}
        for name, future in futures.items():
            try:
                results[name] = future.result(timeout=20)
            except:
                results[name] = None

    top_model = priority[0][0]
    if results.get(top_model):
        return results[top_model], top_model

    for model_name, _ in priority:
        if results.get(model_name):
            return results[model_name], model_name

    return text, "fallback"

def ensemble_sentiment(text, user_id=None):
    priority = get_model_priority(user_id, "sentiment") if user_id else [
        ("xlm_roberta", 1.0), ("gemini", 1.0), ("groq", 1.0)
    ]

    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = {
            "xlm_roberta": executor.submit(xlm_sentiment, text),
            "gemini": executor.submit(gemini_sentiment, text),
            "groq": executor.submit(groq_sentiment, text),
        }
        results = {}
        for name, future in futures.items():
            try:
                result = future.result(timeout=20)
                if isinstance(result, tuple):
                    results[name] = result
                else:
                    results[name] = (result, 0.85)
            except:
                results[name] = (None, None)

    labels = [results[m][0] for m in results if results[m][0] is not None]
    voted_label = majority_vote(labels)

    if not voted_label:
        return "NEUTRAL", 0.5, "fallback"

    top_model = priority[0][0]
    if results.get(top_model) and results[top_model][0]:
        return results[top_model][0], results[top_model][1] or 0.85, top_model

    for model_name, _ in priority:
        if results.get(model_name) and results[model_name][0]:
            return voted_label, results[model_name][1] or 0.85, model_name

    return voted_label, 0.75, "majority"