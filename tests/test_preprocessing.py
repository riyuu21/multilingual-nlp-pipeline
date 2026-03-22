from preprocessing.text_preprocess import preprocess_text
from preprocessing.hinglish_converter import normalize_hinglish

def test_preprocess_lowercase():
    assert preprocess_text("HELLO WORLD") == "hello world"

def test_preprocess_removes_punctuation():
    assert preprocess_text("hello, world!") == "hello world"

def test_preprocess_removes_extra_spaces():
    assert preprocess_text("hello   world") == "hello world"

def test_preprocess_empty_string():
    assert preprocess_text("") == ""

def test_preprocess_none():
    assert preprocess_text(None) == ""

def test_normalize_hinglish_basic():
    assert normalize_hinglish("nhi") == "nahin"

def test_normalize_hinglish_multiple():
    result = normalize_hinglish("bahut acha hai")
    assert "accha" in result
    assert "bahut" in result

def test_normalize_hinglish_unknown_words():
    assert normalize_hinglish("xyz123") == "xyz123"