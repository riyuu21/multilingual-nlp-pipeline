from transformers import MarianMTModel, MarianTokenizer

model_cache = {}

def get_model(source_lang, target_lang="en"):
    model_name = f"Helsinki-NLP/opus-mt-{source_lang}-{target_lang}"

    if model_name not in model_cache:
        try:
            tokenizer = MarianTokenizer.from_pretrained(model_name)
            model = MarianMTModel.from_pretrained(model_name)
            model_cache[model_name] = (tokenizer, model)
        except:
            return None, None

    return model_cache.get(model_name, (None, None))

def translate_text(text, source_lang, target_lang="en"):
    if source_lang == target_lang:
        return text

    tokenizer, model = get_model(source_lang, target_lang)

    if tokenizer and model:
        try:
            inputs = tokenizer(text, return_tensors="pt", padding=True)
            translated = model.generate(**inputs)
            return tokenizer.decode(translated[0], skip_special_tokens=True)
        except:
            pass

    try:
        from deep_translator import GoogleTranslator
        return GoogleTranslator(source=source_lang, target=target_lang).translate(text)
    except Exception as e:
        return f"Translation failed: {str(e)}"