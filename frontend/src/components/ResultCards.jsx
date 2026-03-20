import { useState } from "react";
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

function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button className="copy-btn" onClick={handleCopy}>
            {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
            )}
            {copied ? "Copied!" : "Copy"}
        </button>
    );
}

function FeedbackButtons({ onPositive, onNegative, feedback }) {
    return (
        <div className="feedback-row">
            <button
                className={`feedback-btn ${feedback === "positive" ? "active-positive" : ""}`}
                onClick={onPositive}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>
                </svg>
            </button>
            <button
                className={`feedback-btn ${feedback === "negative" ? "active-negative" : ""}`}
                onClick={onNegative}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/>
                </svg>
            </button>
        </div>
    );
}

function ResultCards({ result, userId }) {
    const [sentimentFeedback, setSentimentFeedback] = useState(null);
    const [languageFeedback, setLanguageFeedback] = useState(null);
    const [visible, setVisible] = useState(false);

    if (!result) return null;

    if (result.error) {
        return <p className="error">{result.error}</p>;
    }

    const sendFeedback = async (feedbackType, prediction, feedback, setter) => {
        try {
            await axios.post(`${API_URL}/feedback`, {
                text: result.translated_text,
                prediction,
                feedback,
                feedback_type: feedbackType,
                user_id: userId
            });
            setter(feedback);
        } catch (e) {
            alert("Could not save feedback");
        }
    };

    const sentimentKey = result.prediction?.toUpperCase();
    const sentimentStyle = SENTIMENT_STYLES[sentimentKey] || { background: "#ccc", color: "#fff" };

    return (
        <div className="results-grid animate-in">
            <div className="card">
                <div className="card-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
                    </svg>
                    <span>Detected Language</span>
                </div>
                <p className="card-value">{LANGUAGE_NAMES[result.language] || result.language}</p>
                <small>{(result.language_confidence * 100).toFixed(1)}% confidence</small>
                <FeedbackButtons
                    feedback={languageFeedback}
                    onPositive={() => sendFeedback("language", result.language, "positive", setLanguageFeedback)}
                    onNegative={() => sendFeedback("language", result.language, "negative", setLanguageFeedback)}
                />
            </div>

            <div className="card">
                <div className="card-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>
                    </svg>
                    <span>Translation</span>
                </div>
                <p className="card-value">{result.translated_text}</p>
                <CopyButton text={result.translated_text} />
                <FeedbackButtons
                    feedback={null}
                    onPositive={() => {}}
                    onNegative={() => {}}
                />
            </div>

            <div className="card">
                <div className="card-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
                    </svg>
                    <span>Sentiment</span>
                </div>
                <span className="badge" style={sentimentStyle}>
                    {sentimentKey}
                </span>
                <small>Score: {result.confidence?.toFixed(2)}</small>
                <FeedbackButtons
                    feedback={sentimentFeedback}
                    onPositive={() => sendFeedback("sentiment", result.prediction, "positive", setSentimentFeedback)}
                    onNegative={() => sendFeedback("sentiment", result.prediction, "negative", setSentimentFeedback)}
                />
            </div>
        </div>
    );
}

export default ResultCards;