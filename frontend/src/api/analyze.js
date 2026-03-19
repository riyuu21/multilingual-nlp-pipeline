import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export async function analyzeText(text, sourceLang, targetLang, userId) {
    const payload = { text, target_lang: targetLang, user_id: userId };
    if (sourceLang) payload.source_lang = sourceLang;
    const res = await axios.post(`${API_URL}/analyze`, payload);
    return res.data;
}