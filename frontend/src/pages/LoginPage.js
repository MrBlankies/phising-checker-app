import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function LoginPage({ setLoggedIn, setUsername }) {
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!usernameInput || !password) {
      setResult("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: usernameInput,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setResult(data.error);
      } else {
        setLoggedIn(true);
        setUsername(usernameInput);
        setResult("Login successful");
        navigate("/history");
      }
    } catch (error) {
      setResult("Backend connection failed");
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>

      <div className="card">
        <input
          type="text"
          placeholder="Username"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p style={{ marginTop: "0px", fontSize: "14px" }}>
          Don't have an account?{" "}
          <Link to="/register">
            Create one now
          </Link>
        </p>

        {result && <div className="result" style={{ marginTop: "-10px", marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>{result}</div>}

        <button onClick={handleLogin} style={{ marginTop: "-5px", marginBottom: "-5px" }}>
          Login
        </button>
      </div>
    </div>
  );
}

export default LoginPage;