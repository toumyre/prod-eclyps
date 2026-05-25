import { useState, useEffect } from "react";
import { useStatsAuth } from "../../contexts/StatsAuthContext";
import "./LoginPage.css";

export default function LoginPage() {
  const { login } = useStatsAuth();

  useEffect(() => {
    const prev = document.title;
    document.title = "ECLYPS — Connexion";
    return () => { document.title = prev; };
  }, []);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="stats-login-wrapper">
      <div className="stats-login-card">
        {/* Logo ECLYPS */}
        <div className="stats-login-logo">
          <img src="/logo.png" alt="ECLYPS" onError={(e) => { e.target.style.display = "none"; }} />
        </div>

        <h1 className="stats-login-title">ECLYPS</h1>
        <p className="stats-login-subtitle">Espace équipe — Accès privé</p>
        <div className="stats-login-divider" />

        <form onSubmit={handleSubmit} className="stats-login-form">
          <div className="stats-login-field">
            <label htmlFor="username">Pseudo</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ECYxTonPseudo"
              autoComplete="username"
              required
            />
          </div>

          <div className="stats-login-field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="stats-login-error">⚠ {error}</p>}

          <button type="submit" className="stats-login-btn" disabled={loading}>
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
