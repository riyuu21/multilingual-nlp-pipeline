import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export async function analyzeText(text, sourceLang, targetLang, userId) {
    const payload = { text, target_lang: targetLang, user_id: userId };
    if (sourceLang) payload.source_lang = sourceLang;
    
    try {
        const res = await axios.post(`${API_URL}/analyze`, payload, { timeout: 30000 });
        return res.data;
    } catch (error) {
        if (!error.response) {
            throw { isOffline: true, message: "Cannot reach the server. Please check your connection." };
        }
        if (error.response.status === 429) {
            throw { isRateLimit: true, message: "Too many requests. Please slow down." };
        }
        throw { message: error.response.data?.error || "Something went wrong." };
    }
}