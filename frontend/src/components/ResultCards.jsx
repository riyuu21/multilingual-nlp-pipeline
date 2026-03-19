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

function getSentimentColor(sentiment) {
    if (!sentiment) return "#ccc";
    if (sentiment.toLowerCase().includes("positive")) return "#4CAF50";
    if (sentiment.toLowerCase().includes("negative")) return "#F44336";
    return "#FFC107";
}

function ResultCards({ result, userId }) {
    const [sentimentFeedback, setSentimentFeedback] = useState(null);
    const [languageFeedback, setLanguageFeedback] = useState(null);

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

    return (
        <div className="results-grid">
            <div className="card">
                <h3>Language</h3>
                <p>{LANGUAGE_NAMES[result.language] || result.language}</p>
                <small>Confidence: {(result.language_confidence * 100).toFixed(2)}%</small>
                <div className="feedback-row">
                    <span>Correct?</span>
                    <button
                        className={`feedback-btn ${languageFeedback === "positive" ? "active-positive" : ""}`}
                        onClick={() => sendFeedback("language", result.language, "positive", setLanguageFeedback)}
                    >
                        👍
                    </button>
                    <button
                        className={`feedback-btn ${languageFeedback === "negative" ? "active-negative" : ""}`}
                        onClick={() => sendFeedback("language", result.language, "negative", setLanguageFeedback)}
                    >
                        👎
                    </button>
                </div>
            </div>

            <div className="card">
                <h3>Translation</h3>
                <p>{result.translated_text}</p>
            </div>

            <div className="card">
                <h3>Sentiment</h3>
                <span className="badge" style={{ backgroundColor: getSentimentColor(result.prediction) }}>
                    {result.prediction?.toUpperCase()}
                </span>
                <small>Score: {result.confidence.toFixed(2)}</small>
                <div className="feedback-row">
                    <span>Correct?</span>
                    <button
                        className={`feedback-btn ${sentimentFeedback === "positive" ? "active-positive" : ""}`}
                        onClick={() => sendFeedback("sentiment", result.prediction, "positive", setSentimentFeedback)}
                    >
                        👍
                    </button>
                    <button
                        className={`feedback-btn ${sentimentFeedback === "negative" ? "active-negative" : ""}`}
                        onClick={() => sendFeedback("sentiment", result.prediction, "negative", setSentimentFeedback)}
                    >
                        👎
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ResultCards;