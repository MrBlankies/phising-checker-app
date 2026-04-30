import React, { useState } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleCheck = async () => {
    if (!url) {
      setResult({ error: "Please enter a URL" });
      return;
    }

    if (!isValidUrl(url)) {
      setResult({ error: "Invalid URL format" });
      return;
    }

    setLoading(true);
    setResult({});

    try {
      const response = await fetch("http://127.0.0.1:8000/api/predict/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.error) {
        setResult({ error: data.error });
      } else {
        setResult({
          prediction: data.prediction,
          confidence: data.confidence,
        });
      }
    } catch (error) {
      setResult({ error: "Backend connection failed" });
    }

    setLoading(false);
  };

  const getClass = () => {
    if (!result.prediction) return "";
    return result.prediction === "Phishing" ? "phishing" : "safe";
  };

  return (
    <div className="container">
      <h1>🪝HookTrap</h1>
      <p>AI Powered Phishing URL Detection</p>

      <div className="card">
        <h2 id="heading">Start Scanning</h2>
        <p id="description">Paste your suspicious link here</p>
        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button onClick={handleCheck}>
          {loading ? "Scanning..." : "Scan"}
        </button>

        {/* ERROR */}
        {!loading && result.error && (
          <div className="result warning">{result.error}</div>
        )}

        {/* RESULT */}
        {!loading && result.prediction && (
          <div className={`result ${getClass()}`}>
            <h2>{result.prediction}</h2>
            <p>Confidence: {result.confidence * 100}%</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;