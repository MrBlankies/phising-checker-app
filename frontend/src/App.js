import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ScanPage from "./pages/ScanPage";
import HistoryPage from "./pages/HistoryPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // Refresh wont log user out if they logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/history/", {
          credentials: "include",
        });

        if (res.status === 200) {
          setLoggedIn(true);
        }
        else {
          setLoggedIn(false);
        }
      } catch {}
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout/", {
      credentials: "include",
    });

    setLoggedIn(false);
    setUsername("");
    navigate("/login"); 
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/scan">Scanner</Link>
        <Link to="/history">History</Link>

        {loggedIn ? (
          <span onClick={handleLogout} style={{ cursor: "pointer" }}>
            Logout
          </span>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scan" element={<ScanPage />} />

        <Route
          path="/history"
          element={
            loggedIn ? (
              <HistoryPage />
            ) : (
              <div className="container">
                <div className="card">
                  <h2>Login Required</h2>
                  <p>Please login first to view scan history.</p>
                </div>
              </div>
            )
          }
        />

        <Route
          path="/login"
          element={
            <LoginPage
              setLoggedIn={setLoggedIn}
              setUsername={setUsername}
            />
          }
        />
        <Route
          path="/register"
          element={
            <RegisterPage
              setLoggedIn={setLoggedIn}
              setUsername={setUsername}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;