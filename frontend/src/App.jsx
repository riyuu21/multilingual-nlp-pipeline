import { useState } from "react";
import { analyzeText } from "./api/analyze";
import LanguageSelector from "./components/LanguageSelector";
import TextInput from "./components/TextInput";
import ResultCards from "./components/ResultCards";
import "./App.css";

function App() {
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
            const data = await analyzeText(text, sourceLang, targetLang);
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

    return (
        <div className="container">
            <h1>Multilingual NLP Analyzer</h1>
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
            <ResultCards result={result} />
        </div>
    );
}

export default App;