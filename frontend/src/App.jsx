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
            <div className="header">
                <h1>Multilingual NLP Analyzer</h1>
                <div className="user-info">
                    <img src={user.picture} alt={user.name} />
                    <span>{user.name}</span>
                    <button className="logout-btn" onClick={() => setUser(null)}>Logout</button>
                </div>
            </div>

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
    );
}

export default App;