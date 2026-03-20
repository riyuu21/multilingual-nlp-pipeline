from deep_translator import GoogleTranslator
from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate

HINGLISH_MAP = {
    "kon": "kaun",
    "kon": "kaun",
    "tum": "tum",
    "kya": "kya",
    "kaise": "kaise",
    "ho": "ho",
    "hai": "hai",
    "acha": "accha",
    "achha": "accha",
    "bura": "bura",
    "nahi": "nahin",
    "nhi": "nahin",
    "mera": "mera",
    "tera": "tera",
    "hum": "hum",
    "aap": "aap",
    "yaar": "yaar",
    "bhai": "bhai",
    "dost": "dost",
    "pyaar": "pyar",
    "mohabbat": "mohabbat",
    "zindagi": "zindagi",
    "khana": "khana",
    "pani": "pani",
    "ghar": "ghar",
    "kaam": "kaam",
    "time": "samay",
    "theek": "theek",
    "thik": "theek",
    "bilkul": "bilkul",
    "bahut": "bahut",
    "bohot": "bahut",
    "bohat": "bahut",
    "abhi": "abhi",
    "kal": "kal",
    "aaj": "aaj",
    "raat": "raat",
    "din": "din",
    "subah": "subah",
    "shaam": "shaam",
    "accha": "accha",
    "bura": "bura",
    "sahi": "sahi",
    "galat": "galat",
    "sundar": "sundar",
    "mast": "mast",
    "zabardast": "zabardast",
    "bekar": "bekar",
    "bakwaas": "bakwas",
    "matlab": "matlab",
    "samajh": "samajh",
    "pata": "pata",
    "pta": "pata",
    "jana": "jana",
    "aana": "aana",
    "dekh": "dekh",
    "sun": "sun",
    "bol": "bol",
    "kar": "kar",
    "karo": "karo",
    "karta": "karta",
    "karti": "karti",
    "raha": "raha",
    "rahi": "rahi",
    "hoga": "hoga",
    "hogi": "hogi",
    "chahiye": "chahiye",
    "chahie": "chahiye",
    "milega": "milega",
    "milegi": "milegi",
    "lagta": "lagta",
    "lagti": "lagti",
    "dil": "dil",
    "mann": "man",
    "khushi": "khushi",
    "dukh": "dukh",
    "gussa": "gussa",
    "darr": "dar",
    "dar": "dar",
    "ummeed": "umeed",
    "umeed": "umeed",
}

def normalize_hinglish(text):
    words = text.lower().split()
    return " ".join([HINGLISH_MAP.get(w, w) for w in words])

def to_devanagari(text):
    try:
        return transliterate(text, sanscript.ITRANS, sanscript.DEVANAGARI)
    except:
        return text

def hinglish_to_english(text):
    try:
        normalized = normalize_hinglish(text)
        devanagari = to_devanagari(normalized)
        result = GoogleTranslator(source='hi', target='en').translate(devanagari)
        if not result or result.strip() == "":
            return GoogleTranslator(source='auto', target='en').translate(normalized)
        return result
    except:
        try:
            return GoogleTranslator(source='auto', target='en').translate(text)
        except:
            return text