function LanguageSelector({ sourceLang, targetLang, setSourceLang, setTargetLang }) {
    const languages = [
        { value: "en", label: "English" },
        { value: "hi", label: "Hindi" },
        { value: "fr", label: "French" },
        { value: "es", label: "Spanish" },
        { value: "hinglish", label: "Hinglish" },
    ];

    return (
        <div className="select-row">
            <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
                <option value="">Auto Detect</option>
                {languages.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                ))}
            </select>

            <span>→</span>

            <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
                {languages.filter(l => l.value !== "hinglish").map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                ))}
            </select>
        </div>
    );
}

export default LanguageSelector;