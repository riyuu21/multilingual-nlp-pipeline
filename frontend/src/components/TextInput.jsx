function TextInput({ text, setText, onAnalyze, loading }) {
    return (
        <div className="input-section">
            <textarea
                placeholder="Type text in Hindi, English, Hinglish..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button onClick={onAnalyze} disabled={loading}>
                {loading ? "Processing..." : "Analyze"}
            </button>
        </div>
    );
}

export default TextInput;