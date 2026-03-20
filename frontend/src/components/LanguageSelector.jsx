import SearchableSelect from "./SearchableSelect";

const SOURCE_LANGUAGES = [
    { value: "", label: "Auto Detect" },
    { value: "hinglish", label: "Hinglish" },
    { value: "af", label: "Afrikaans" },
    { value: "sq", label: "Albanian" },
    { value: "ar", label: "Arabic" },
    { value: "az", label: "Azerbaijani" },
    { value: "be", label: "Belarusian" },
    { value: "bn", label: "Bengali" },
    { value: "bs", label: "Bosnian" },
    { value: "bg", label: "Bulgarian" },
    { value: "ca", label: "Catalan" },
    { value: "zh", label: "Chinese" },
    { value: "hr", label: "Croatian" },
    { value: "cs", label: "Czech" },
    { value: "da", label: "Danish" },
    { value: "nl", label: "Dutch" },
    { value: "en", label: "English" },
    { value: "eo", label: "Esperanto" },
    { value: "et", label: "Estonian" },
    { value: "fi", label: "Finnish" },
    { value: "fr", label: "French" },
    { value: "gl", label: "Galician" },
    { value: "de", label: "German" },
    { value: "el", label: "Greek" },
    { value: "gu", label: "Gujarati" },
    { value: "ht", label: "Haitian Creole" },
    { value: "he", label: "Hebrew" },
    { value: "hi", label: "Hindi" },
    { value: "hu", label: "Hungarian" },
    { value: "is", label: "Icelandic" },
    { value: "id", label: "Indonesian" },
    { value: "ga", label: "Irish" },
    { value: "it", label: "Italian" },
    { value: "ja", label: "Japanese" },
    { value: "kn", label: "Kannada" },
    { value: "kk", label: "Kazakh" },
    { value: "ko", label: "Korean" },
    { value: "lv", label: "Latvian" },
    { value: "lt", label: "Lithuanian" },
    { value: "mk", label: "Macedonian" },
    { value: "ms", label: "Malay" },
    { value: "ml", label: "Malayalam" },
    { value: "mt", label: "Maltese" },
    { value: "mr", label: "Marathi" },
    { value: "ne", label: "Nepali" },
    { value: "nb", label: "Norwegian" },
    { value: "fa", label: "Persian" },
    { value: "pl", label: "Polish" },
    { value: "pt", label: "Portuguese" },
    { value: "pa", label: "Punjabi" },
    { value: "ro", label: "Romanian" },
    { value: "ru", label: "Russian" },
    { value: "sr", label: "Serbian" },
    { value: "sk", label: "Slovak" },
    { value: "sl", label: "Slovenian" },
    { value: "es", label: "Spanish" },
    { value: "sw", label: "Swahili" },
    { value: "sv", label: "Swedish" },
    { value: "tl", label: "Tagalog" },
    { value: "ta", label: "Tamil" },
    { value: "te", label: "Telugu" },
    { value: "th", label: "Thai" },
    { value: "tr", label: "Turkish" },
    { value: "uk", label: "Ukrainian" },
    { value: "ur", label: "Urdu" },
    { value: "vi", label: "Vietnamese" },
    { value: "cy", label: "Welsh" },
];

const TARGET_LANGUAGES = SOURCE_LANGUAGES.filter(l => l.value !== "" && l.value !== "hinglish");

function LanguageSelector({ sourceLang, targetLang, setSourceLang, setTargetLang }) {
    return (
        <div className="select-row">
            <SearchableSelect
                value={sourceLang}
                onChange={setSourceLang}
                options={SOURCE_LANGUAGES}
                placeholder="Auto Detect"
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted-text)", flexShrink: 0 }}>
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
            <SearchableSelect
                value={targetLang}
                onChange={setTargetLang}
                options={TARGET_LANGUAGES}
                placeholder="Target Language"
            />
        </div>
    );
}

export default LanguageSelector;