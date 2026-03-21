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
    const [filterBy, setFilterBy] = useState("all");
    const [filterValue, setFilterValue] = useState("");

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.toISOString().slice(0, 7);
    const currentDay = today.toISOString().slice(0, 10);

    const years = Array.from({ length: 5 }, (_, i) => String(currentYear - i));
    const months = Array.from({ length: 12 }, (_, i) => {
        const d = new Date(currentYear, i, 1);
        return {
            value: `${currentYear}-${String(i + 1).padStart(2, "0")}`,
            label: d.toLocaleString("default", { month: "long" })
        };
    });

    useEffect(() => {
        fetchHistory();
    }, [filterBy, filterValue]);

    async function fetchHistory() {
        setLoading(true);
        try {
            let url = `${API_URL}/history?user_id=${userId}`;
            if (filterBy !== "all" && filterValue) {
                url += `&filter_by=${filterBy}&filter_value=${filterValue}`;
            }
            const res = await axios.get(url);
            setHistory(res.data);
        } catch (e) {
            setHistory([]);
        }
        setLoading(false);
    }

    const handleFilterChange = (type) => {
        setFilterBy(type);
        if (type === "day") setFilterValue(currentDay);
        else if (type === "month") setFilterValue(currentMonth);
        else if (type === "year") setFilterValue(String(currentYear));
        else setFilterValue("");
    };

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

                <div className="history-filters">
                    {["all", "day", "month", "year"].map((f) => (
                        <button
                            key={f}
                            className={`filter-btn ${filterBy === f ? "active" : ""}`}
                            onClick={() => handleFilterChange(f)}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {filterBy === "day" && (
                    <div className="filter-select-row">
                        <input
                            type="date"
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            className="filter-date-input"
                        />
                    </div>
                )}

                {filterBy === "month" && (
                    <div className="filter-select-row">
                        <select
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            className="filter-date-input"
                        >
                            {months.map((m) => (
                                <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                        </select>
                    </div>
                )}

                {filterBy === "year" && (
                    <div className="filter-select-row">
                        <select
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            className="filter-date-input"
                        >
                            {years.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                )}

                {loading && (
                    <div className="history-list">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="history-item">
                                <div className="skeleton skeleton-label" style={{ width: "40%" }} />
                                <div className="skeleton skeleton-value" style={{ width: "90%" }} />
                                <div className="skeleton skeleton-small" style={{ width: "60%" }} />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && history.length === 0 && (
                    <p className="history-empty">No history found for this period.</p>
                )}

                {!loading && history.length > 0 && (
                    <div className="history-list">
                        {history.map((item, index) => {
                            const sentimentKey = item.prediction?.toUpperCase();
                            const sentimentStyle = SENTIMENT_STYLES[sentimentKey] || {};
                            return (
                                <div key={index} className="history-item animate-in">
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