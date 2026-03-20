import { useState } from "react";
import { analyzeText } from "./api/analyze";
import LanguageSelector from "./components/LanguageSelector";
import TextInput from "./components/TextInput";
import ResultCards from "./components/ResultCards";
import Login from "./components/Login";
import "./App.css";

function App() {
    const [user, setUser] = useState(null);
    const [text, setText] = useState("");
    const [sourceLang, setSourceLang] = useState("");
    const [targetLang, setTargetLang] = useState("en");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setResult(null);
        try {
            const data = await analyzeText(text, sourceLang, targetLang, user?.id);
            setResult(data);
        } catch (error) {
            if (error.response) {
                setResult({ error: JSON.stringify(error.response.data) });
            } else {
                setResult({ error: error.message });
            }
        }
        setLoading(false);
    };

    if (!user) {
        return <Login onLogin={setUser} />
    }

    return (
        <div className="container">
            <header className="app-header">
                <div className="header-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>
                    </svg>
                    <span>Multilingual NLP Analyzer</span>
                </div>
                <div className="header-right">
                    <img src={user.picture} alt={user.name} />
                    <span>{user.name}</span>
                    <button className="logout-btn" onClick={() => setUser(null)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Logout
                    </button>
                </div>
            </header>

            <div className="main-content">
                <LanguageSelector
                    sourceLang={sourceLang}
                    targetLang={targetLang}
                    setSourceLang={setSourceLang}
                    setTargetLang={setTargetLang}
                />
                <TextInput
                    text={text}
                    setText={setText}
                    onAnalyze={handleAnalyze}
                    loading={loading}
                />
                <ResultCards result={result} userId={user?.id} />
            </div>
        </div>
    );
}

export default App;