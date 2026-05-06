import React, { useEffect, useState } from "react";
import "../App.css";

function HistoryPage() {
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    const response = await fetch("/api/history/", { credentials: "include" }); 
    const data = await response.json();
    setHistory(data);
  };

  const clearHistory = async () => {
  if (window.confirm("Clear history?"))
  await fetch("/api/history/delete/", { credentials: "include", method: "DELETE" });

  loadHistory();
};

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="container">
      <h1>Scan History</h1>

      <div className="card">
        <button onClick={clearHistory} style={{ marginBottom: "0px", marginTop: "0px" }}>
            Clear History
        </button>
        {history.length === 0 ? (
          <p>No scans found.</p>
        ) : (
          history.map((item, index) => (
            <div
  key={item.id}
  className="result"
  style={{ marginBottom: "10px", textAlign: "left", width: "92%" }}
>
  <strong style={{ fontSize: "14px" }}>{item.url}</strong>
  <br />
  <hr style={{ margin: "10px 0" }} />

  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span>
      {item.prediction} ({Math.round(item.confidence * 100)}%)
    </span>

    <small style={{ color: "#555", whiteSpace: "nowrap" }}>
      {item.date}
    </small>
  </div>
</div>
          ))
        )}
      </div>
    </div>
  );
}

export default HistoryPage;