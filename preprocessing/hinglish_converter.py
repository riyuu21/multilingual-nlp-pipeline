from deep_translator import GoogleTranslator
from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate

# ============================================================
# WHAT CAN WE IMPROVE?
# ============================================================
# 1. This dictionary uses exact word matching — fuzzy matching
#    would handle typos and spelling variations much better
# 2. Context is not considered — "kal" means both "yesterday"
#    and "tomorrow" depending on context, we always map to "kal"
# 3. Sarcasm and idioms are not handled — "kya baat hai" can
#    mean both "what's the matter" and "wow amazing"
# 4. The indic_transliteration library uses ITRANS scheme which
#    doesn't always match how people actually type Hinglish
# 5. Adding a proper Hinglish NLP model would fix most of these
# ============================================================

HINGLISH_MAP = {
    # Pronouns
    "kon": "kaun", "tum": "tum", "kya": "kya", "kaise": "kaise",
    "ho": "ho", "hai": "hai", "hain": "hain", "hoon": "hun",
    "mein": "main", "main": "main", "mujhe": "mujhe", "mujhko": "mujhe",
    "hum": "hum", "aap": "aap", "aapko": "aapko", "tumhe": "tumhe",
    "tumko": "tumhe", "unhe": "unhe", "unko": "unhe", "isko": "ise",
    "use": "use", "usse": "use", "inhe": "inhe", "inko": "inhe",
    "yeh": "yah", "ye": "yah", "woh": "vah", "wo": "vah",
    "tera": "tera", "mera": "mera", "uska": "uska", "uski": "uski",
    "hamara": "hamara", "tumhara": "tumhara", "apna": "apna",

    # Common verbs
    "kar": "kar", "karo": "karo", "karta": "karta", "karti": "karti",
    "karte": "karte", "karna": "karna", "kiya": "kiya", "ki": "ki",
    "ja": "ja", "jao": "jao", "jana": "jana", "jata": "jata",
    "jati": "jati", "gaya": "gaya", "gayi": "gayi", "aana": "aana",
    "aao": "aao", "aa": "aa", "aya": "aaya", "ayi": "aayi",
    "dekh": "dekh", "dekho": "dekho", "dekha": "dekha", "dekhna": "dekhna",
    "sun": "sun", "suno": "suno", "suna": "suna", "sunna": "sunna",
    "bol": "bol", "bolo": "bolo", "bola": "bola", "bolna": "bolna",
    "reh": "reh", "raho": "raho", "raha": "raha", "rahi": "rahi",
    "so": "so", "soja": "so ja", "soye": "soye", "sota": "sota",
    "kha": "kha", "khao": "khao", "khana": "khana", "khaya": "khaya",
    "pi": "pi", "piyo": "piyo", "pina": "pina", "piya": "piya",
    "de": "de", "dena": "dena", "diya": "diya", "dedo": "de do",
    "le": "le", "lena": "lena", "liya": "liya", "lelo": "le lo",
    "bata": "bata", "batao": "batao", "batana": "batana",
    "samajh": "samajh", "samjho": "samjho", "samjha": "samjha",
    "chal": "chal", "chalo": "chalo", "chalna": "chalna",
    "ruk": "ruk", "ruko": "ruko", "rukna": "rukna",
    "has": "has", "haso": "haso", "hasna": "hasna", "hasa": "hasa",
    "ro": "ro", "rona": "rona", "roya": "roya", "royi": "royi",
    "milna": "milna", "milo": "milo", "mila": "mila", "milegi": "milegi",
    "laga": "laga", "lagta": "lagta", "lagti": "lagti", "lagana": "lagana",
    "rakho": "rakho", "rakhna": "rakhna", "rakha": "rakha",
    "bhejo": "bhejo", "bhejna": "bhejna", "bheja": "bheja",
    "lao": "lao", "laana": "laana", "laya": "laya",
    "uthao": "uthao", "uthna": "uthna", "utha": "utha",
    "baithna": "baithna", "baitho": "baitho", "baitha": "baitha",
    "khelo": "khelo", "khelna": "khelna", "khela": "khela",
    "padho": "padho", "padhna": "padhna", "padha": "padha",
    "likho": "likho", "likhna": "likhna", "likha": "likha",
    "socho": "socho", "sochna": "sochna", "socha": "socha",

    # Adjectives
    "acha": "accha", "achha": "accha", "accha": "accha",
    "bura": "bura", "buri": "buri",
    "theek": "theek", "thik": "theek", "tik": "theek",
    "sahi": "sahi", "galat": "galat",
    "sundar": "sundar", "khubsurat": "khubsurat",
    "mast": "mast", "zabardast": "zabardast", "ekdum": "ekdum",
    "bekar": "bekar", "bakwaas": "bakwas", "bakvas": "bakwas",
    "bada": "bada", "badi": "badi", "bade": "bade",
    "chota": "chhota", "choti": "chhoti", "chhota": "chhota",
    "naya": "naya", "nayi": "nayi", "purana": "purana",
    "saaf": "saaf", "ganda": "ganda",
    "tez": "tez", "dheema": "dheema", "dheere": "dheere",
    "mushkil": "mushkil", "aasaan": "aasaan", "asan": "aasaan",
    "important": "zaroori", "zaroori": "zaroori",
    "sach": "sach", "jhooth": "jhooth", "jhuta": "jhoota",
    "khush": "khush", "udaas": "udaas", "dukhi": "dukhi",
    "thaka": "thaka", "thaki": "thaki", "thake": "thake",
    "bhuka": "bhookha", "bhookha": "bhookha", "pyaasa": "pyaasa",

    # Common nouns
    "yaar": "yaar", "bhai": "bhai", "dost": "dost", "dosth": "dost",
    "behen": "bahan", "bahan": "bahan", "mama": "mama", "chacha": "chacha",
    "ghar": "ghar", "घर": "ghar", "school": "vidyalay",
    "kaam": "kaam", "kaam": "kaam", "naukri": "naukri",
    "paise": "paise", "paisa": "paisa", "rupaye": "rupaye",
    "khana": "khana", "khaana": "khana", "pani": "pani",
    "chai": "chai", "chaay": "chai", "coffee": "coffee",
    "raat": "raat", "din": "din", "subah": "subah", "shaam": "shaam",
    "kal": "kal", "aaj": "aaj", "parso": "parso",
    "abhi": "abhi", "baad": "baad", "pehle": "pehle",
    "time": "samay", "waqt": "waqt", "ghanta": "ghanta",
    "dil": "dil", "mann": "man", "dimag": "dimaag",
    "zindagi": "zindagi", "duniya": "duniya",
    "pyaar": "pyar", "mohabbat": "mohabbat", "ishq": "ishq",
    "gussa": "gussa", "khushi": "khushi", "dukh": "dukh",
    "darr": "dar", "dar": "dar", "sharam": "sharam",

    # Common expressions
    "nahi": "nahin", "nhi": "nahin", "na": "nahin", "naa": "nahin",
    "haan": "haan", "han": "haan", "ha": "haan",
    "bilkul": "bilkul", "zaroor": "zaroor", "matlab": "matlab",
    "ummeed": "umeed", "umeed": "umeed", "shayad": "shayad",
    "pata": "pata", "pta": "pata", "maloom": "maloom",
    "bahut": "bahut", "bohot": "bahut", "bohat": "bahut", "bhaut": "bahut",
    "thoda": "thoda", "thodi": "thodi", "kam": "kam", "zyada": "zyada",
    "sirf": "sirf", "bas": "bas", "hi": "hi", "bhi": "bhi",
    "toh": "toh", "to": "toh", "par": "par", "lekin": "lekin",
    "kyunki": "kyunki", "kyuki": "kyunki", "isliye": "isliye",
    "phir": "phir", "fir": "phir", "dobara": "dobara",
    "agar": "agar", "jab": "jab", "tab": "tab", "jaise": "jaise",
    "chahiye": "chahiye", "chahie": "chahiye", "chahte": "chahte",
    "please": "kripya", "sorry": "maafi", "thanks": "shukriya",
    "shukriya": "shukriya", "dhanyawad": "dhanyawad",
    "namaste": "namaste", "namaskar": "namaskar",
    "alvida": "alvida", "bye": "alvida",
    "kyu": "kyun", "kyun": "kyun", "kyunki": "kyunki",
    "kaisa": "kaisa", "kaisi": "kaisi",
    "kitna": "kitna", "kitni": "kitni", "kitne": "kitne",
    "kahan": "kahan", "kha": "kahan", "kidhar": "kidhar",
    "kab": "kab", "kaise": "kaise", "kyun": "kyun",
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