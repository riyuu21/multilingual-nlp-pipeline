from transformers import M2M100ForConditionalGeneration, M2M100Tokenizer

model_name = "facebook/m2m100_418M"

tokenizer = M2M100Tokenizer.from_pretrained(model_name)
model = M2M100ForConditionalGeneration.from_pretrained(model_name)


def translate_text(text, source_lang, target_lang="en"):

    if source_lang == target_lang:
        return text

    tokenizer.src_lang = source_lang

    encoded = tokenizer(text, return_tensors="pt")

    generated_tokens = model.generate(
        **encoded,
        forced_bos_token_id=tokenizer.get_lang_id(target_lang)
    )

    translated = tokenizer.batch_decode(generated_tokens, skip_special_tokens=True)[0]

    return translated