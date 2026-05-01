import React, { useEffect, useState } from "react";
import "../App.css";

function HistoryPage() {
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/history/");
    const data = await response.json();
    setHistory(data);
  };

  const clearHistory = async () => {
  await fetch("http://127.0.0.1:8000/api/history/delete/", {
    method: "DELETE",
  });

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
  key={index}
  className="result"
  style={{ marginBottom: "10px", textAlign: "left" }}
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