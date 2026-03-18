import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export async function analyzeText(text, sourceLang, targetLang) {
    const payload = { text, target_lang: targetLang };
    if (sourceLang) payload.source_lang = sourceLang;
    const res = await axios.post(`${API_URL}/analyze`, payload);
    return res.data;
}