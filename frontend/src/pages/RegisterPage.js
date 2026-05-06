import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function RegisterPage({ setLoggedIn, setUsername }) {
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [result, setResult] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!usernameInput || !password || !confirmPassword) {
      setResult("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setResult("Passwords do not match");
      return;
    } 

    if (password.length < 5) {
      setResult("Password must be at least 5 characters");
      return;
    }

    try {
      const response = await fetch("/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username: usernameInput, password }),
      });

      const data = await response.json();

      if (data.error) {
        setResult(data.error);
      } else {
        setResult("Account created successfully");
        setLoggedIn(true);
        setUsername(usernameInput);
        navigate("/scan");
      }
    } catch {
      setResult("Backend connection failed");
    }
  };

  return (
    <div className="container">
      <h1>Create Account</h1>

      <div className="card">
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsernameInput(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <p style={{ marginTop: "0px", fontSize: "14px" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>

        {result && <div className="result" style={{ marginTop: "-10px", marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>{result}</div>}
        <button onClick={handleRegister} style={{ marginTop: "-5px", marginBottom: "-5px" }}>Register</button>
      </div>
    </div>
  );
}

export default RegisterPage;