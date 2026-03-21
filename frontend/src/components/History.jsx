import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

const LANGUAGE_NAMES = {
    af: "Afrikaans", sq: "Albanian", ar: "Arabic", az: "Azerbaijani",
    be: "Belarusian", bn: "Bengali", bs: "Bosnian", bg: "Bulgarian",
    ca: "Catalan", zh: "Chinese", hr: "Croatian", cs: "Czech",
    da: "Danish", nl: "Dutch", en: "English", eo: "Esperanto",
    et: "Estonian", fi: "Finnish", fr: "French", gl: "Galician",
    de: "German", el: "Greek", gu: "Gujarati", ht: "Haitian Creole",
    he: "Hebrew", hi: "Hindi", hu: "Hungarian", is: "Icelandic",
    id: "Indonesian", ga: "Irish", it: "Italian", ja: "Japanese",
    kn: "Kannada", kk: "Kazakh", ko: "Korean", lv: "Latvian",
    lt: "Lithuanian", mk: "Macedonian", ms: "Malay", ml: "Malayalam",
    mt: "Maltese", mr: "Marathi", ne: "Nepali", nb: "Norwegian",
    fa: "Persian", pl: "Polish", pt: "Portuguese", pa: "Punjabi",
    ro: "Romanian", ru: "Russian", sr: "Serbian", sk: "Slovak",
    sl: "Slovenian", es: "Spanish", sw: "Swahili", sv: "Swedish",
    tl: "Tagalog", ta: "Tamil", te: "Telugu", th: "Thai",
    tr: "Turkish", uk: "Ukrainian", ur: "Urdu", vi: "Vietnamese",
    cy: "Welsh", hinglish: "Hinglish"
};

const SENTIMENT_STYLES = {
    POSITIVE: { background: "rgba(58, 158, 95, 0.15)", color: "#3a9e5f" },
    NEGATIVE: { background: "rgba(204, 51, 51, 0.15)", color: "#cc3333" },
    NEUTRAL: { background: "rgba(201, 150, 42, 0.15)", color: "#c9962a" },
};

function History({ userId, onClose }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHistory() {
            try {
                const res = await axios.get(`${API_URL}/history?user_id=${userId}`);
                setHistory(res.data);
            } catch (e) {
                setHistory([]);
            }
            setLoading(false);
        }
        fetchHistory();
    }, [userId]);

    return (
        <div className="history-overlay">
            <div className="history-panel">
                <div className="history-header">
                    <h2>Your History</h2>
                    <button className="history-close" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                        </svg>
                    </button>
                </div>

                {loading && <p className="history-empty">Loading...</p>}

                {!loading && history.length === 0 && (
                    <p className="history-empty">No history yet. Start analyzing some text!</p>
                )}

                {!loading && history.length > 0 && (
                    <div className="history-list">
                        {history.map((item, index) => {
                            const sentimentKey = item.prediction?.toUpperCase();
                            const sentimentStyle = SENTIMENT_STYLES[sentimentKey] || {};
                            return (
                                <div key={index} className="history-item">
                                    <div className="history-item-top">
                                        <span className="history-lang">
                                            {LANGUAGE_NAMES[item.language] || item.language}
                                        </span>
                                        <span className="badge" style={sentimentStyle}>
                                            {sentimentKey}
                                        </span>
                                        <span className="history-time">
                                            {new Date(item.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="history-original">{item.text}</p>
                                    <p className="history-translated">{item.translated_text}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default History;