function TextInput({ text, setText, onAnalyze, loading }) {
    return (
        <div className="input-section">
            <textarea
                placeholder="Enter text in any language..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
            />
            <button onClick={onAnalyze} disabled={loading || !text.trim()}>
                {loading && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spin">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                )}
                {loading ? "Analyzing..." : "Analyze"}
            </button>
        </div>
    );
}

export default TextInput;