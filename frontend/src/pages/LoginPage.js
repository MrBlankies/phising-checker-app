import "../App.css";

function LoginPage() {
  return (
    <div className="container">
      <h1>User Login</h1>

      <div className="card">
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />

        <button style={{ marginTop: "15px" }}>Login</button>
      </div>
    </div>
  );
}

export default LoginPage;