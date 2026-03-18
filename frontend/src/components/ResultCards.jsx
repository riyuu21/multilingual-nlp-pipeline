function getSentimentColor(sentiment) {
    if (!sentiment) return "#ccc";
    if (sentiment.includes("positive")) return "#4CAF50";
    if (sentiment.includes("negative")) return "#F44336";
    return "#FFC107";
}

function ResultCards({ result }) {
    if (!result) return null;

    if (result.error) {
        return <p className="error">{result.error}</p>;
    }

    return (
        <div className="results-grid">
            <div className="card">
                <h3>Language</h3>
                <p>{result.language}</p>
                <small>Confidence: {(result.language_confidence * 100).toFixed(2)}%</small>
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
            </div>
        </div>
    );
}

export default ResultCards;