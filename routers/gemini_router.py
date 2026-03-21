import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

def gemini_translate(text, source_lang, target_lang="en"):
    try:
        prompt = f"""Translate the following text from {source_lang} to {target_lang}.
If the text contains idioms, slang, or cultural expressions, translate the meaning naturally not literally.
Return only the translated text, nothing else.

Text: {text}"""
        response = model.generate_content(prompt)
        return response.text.strip()
    except:
        return None

def gemini_sentiment(text):
    try:
        prompt = f"""Analyze the sentiment of this text. Reply with only one word: POSITIVE, NEGATIVE, or NEUTRAL.

Text: {text}"""
        response = model.generate_content(prompt)
        result = response.text.strip().upper()
        if result in ["POSITIVE", "NEGATIVE", "NEUTRAL"]:
            return result, 0.85
        return None, None
    except:
        return None, None