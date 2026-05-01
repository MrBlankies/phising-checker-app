import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="container">
      <h3 id="logo">🪝HookTrap</h3>
      <h1 id="title">HookTrap</h1>
      <p id="mini-description"><b id="AI">Artifical Intelligence</b> Powered Phishing Protection</p>
      <Link to="/scan">
        <button id="scan-button">Start Scanning</button>
      </Link>
    </div>
  );
}

export default HomePage;