import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeText = async () => {
    if (!text.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>🌍 Multilingual NLP App</h1>

      <textarea
        rows="5"
        cols="50"
        placeholder="Enter text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <br /><br />

      <button onClick={analyzeText}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Results:</h3>
          <p><b>Language:</b> {result.language}</p>
          <p><b>Translation:</b> {result.translation}</p>
          <p><b>Prediction:</b> {result.prediction}</p>
          <p><b>Confidence:</b> {result.confidence.toFixed(3)}</p>
        </div>
      )}
    </div>
  );
}

export default App;