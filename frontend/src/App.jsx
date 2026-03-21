import { useState, useEffect } from "react";
import { analyzeText } from "./api/analyze";
import LanguageSelector from "./components/LanguageSelector";
import TextInput from "./components/TextInput";
import ResultCards from "./components/ResultCards";
import Login from "./components/Login";
import History from "./components/History";
import BuyMeCoffee from "./components/BuyMeCoffee";
import LimitPopup from "./components/LimitPopup";
import Toast from "./components/Toast";
import SkeletonCards from "./components/SkeletonCards";
import InfoSidebar from "./components/InfoSidebar";
import { getDeviceId } from "./utils/fingerprint";
import OfflineBanner from "./components/OfflineBanner";
import { isGuestLimitReached, incrementGuestUsage, getRemainingAnalyses } from "./utils/guestLimit";
import "./App.css";

function App() {
    const [isOffline, setIsOffline] = useState(false);
    const [user, setUser] = useState(null);
    const [text, setText] = useState("");
    const [sourceLang, setSourceLang] = useState("");
    const [targetLang, setTargetLang] = useState("en");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showBMC, setShowBMC] = useState(false);
    const [showLimitPopup, setShowLimitPopup] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [deviceId, setDeviceId] = useState(null);
    const [remaining, setRemaining] = useState(15);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        async function initDevice() {
            const id = await getDeviceId();
            setDeviceId(id);
            setRemaining(getRemainingAnalyses(id));
        }
        initDevice();
    }, []);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
    };

    const handleAnalyze = async () => {
    if (!text.trim()) return;

    if (!user) {
        if (isGuestLimitReached(deviceId)) {
            setShowLimitPopup(true);
            return;
        }
        incrementGuestUsage(deviceId);
        setRemaining(getRemainingAnalyses(deviceId));
    }

    setLoading(true);
    setResult(null);
    setIsOffline(false);

    try {
        const data = await analyzeText(text, sourceLang, targetLang, user?.id);
        setResult(data);
    } catch (error) {
        if (error.isOffline) {
            setIsOffline(true);
        } else if (error.isRateLimit) {
            showToast("Too many requests, slow down!", "error");
        } else {
            setResult({ error: error.message });
        }
    }
    setLoading(false);
};

    const handleLogin = (userData) => {
        setUser(userData);
        setShowLogin(false);
        setShowLimitPopup(false);
    };

    if (showLogin) {
        return <Login onLogin={handleLogin} onSkip={() => setShowLogin(false)} />;
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
                    <button className="bmc-btn" onClick={() => setShowBMC(true)}>
                        ☕ Support
                    </button>
                    <button className="history-btn" onClick={() => setShowInfo(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                        </svg>
                        Help
                    </button>
                    {user && (
                        <button className="history-btn" onClick={() => setShowHistory(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>
                            </svg>
                            History
                        </button>
                    )}
                    {!user && deviceId && (
                        <span className="remaining-badge">
                            {remaining} free left
                        </span>
                    )}
                    {user ? (
                        <>
                            <img src={user.picture} alt={user.name} />
                            <span>{user.name}</span>
                            <button className="logout-btn" onClick={() => setUser(null)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                                </svg>
                                Logout
                            </button>
                        </>
                    ) : (
                        <button className="login-btn" onClick={() => setShowLogin(true)}>
                            Sign in
                        </button>
                    )}
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
                {isOffline && ( 
                    <OfflineBanner
                    onRetry={handleAnalyze} 
                    loading={loading}
                    />
                    )}
                {!user && result && (
                    <div className="guest-prompt">
                        <span>Sign in to save history and unlock adaptive learning</span>
                        <button onClick={() => setShowLogin(true)}>Sign in</button>
                    </div>
                )}
                {loading && <SkeletonCards />}
                {!loading && <ResultCards result={result} userId={user?.id} onToast={showToast} />}
            </div>

            {showHistory && <History userId={user.id} onClose={() => setShowHistory(false)} />}
            {showBMC && <BuyMeCoffee onClose={() => setShowBMC(false)} />}
            {showInfo && <InfoSidebar onClose={() => setShowInfo(false)} />}
            {showLimitPopup && (
                <LimitPopup
                    remaining={remaining}
                    onLogin={() => setShowLogin(true)}
                    onDismiss={() => setShowLimitPopup(false)}
                />
            )}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}

export default App;