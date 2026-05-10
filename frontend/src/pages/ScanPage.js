import React, { useState, useEffect } from "react";
import "../App.css";

function ScanPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    loadHistory();
  }, []);

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
      const response = await fetch("/api/predict/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      setResult(data);

    } catch (error) {
      setResult({ error: "Backend connection failed" });
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>🪝HookTrap</h1>
      <p>Instantly scan suspicious URLs using machine learning predictions.</p>

      <div className="card">
        <h2 id="heading">Start Scanning</h2>
        <p id="description">Paste your suspicious link here</p>
        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        {/* RESULT */}
        {loading && <div className="result">Checking URL...</div>}

        {!loading && result.error && (
          <div className="result warning" style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
            {result.error}
          </div>
        )}

        {!loading && result.prediction && (
          <div
            className={`result ${
              result.prediction === "Phishing" ? "phishing" : "safe"
            }`}
            style={{ width: "92%" }}
          >
            <h2>{result.prediction}</h2>
            <p>Confidence: {Math.round(result.confidence * 100)}%</p>
          </div>
        )}
        <div style={{ marginTop: "20px"}}>
        <button onClick={handleCheck}>
          {loading ? "Scanning..." : "Check URL"}
        </button>
        </div>
      </div>
    </div>
  );
}

export default ScanPage;