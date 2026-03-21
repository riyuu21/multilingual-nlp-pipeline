import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def groq_translate(text, source_lang, target_lang="en"):
    try:
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {
                    "role": "system",
                    "content": "You are a translator. Translate text naturally, understanding idioms and cultural expressions. Return only the translated text, nothing else."
                },
                {
                    "role": "user",
                    "content": f"Translate this from {source_lang} to {target_lang}: {text}"
                }
            ]
        )
        return response.choices[0].message.content.strip()
    except:
        return None

def groq_sentiment(text):
    try:
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {
                    "role": "system",
                    "content": "You are a sentiment analyzer. Reply with only one word: POSITIVE, NEGATIVE, or NEUTRAL."
                },
                {
                    "role": "user",
                    "content": f"Analyze the sentiment: {text}"
                }
            ]
        )
        result = response.choices[0].message.content.strip().upper()
        if result in ["POSITIVE", "NEGATIVE", "NEUTRAL"]:
            return result, 0.85
        return None, None
    except:
        return None, None