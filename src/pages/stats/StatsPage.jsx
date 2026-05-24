import { useState, useEffect } from "react";
import { useStatsAuth } from "../../contexts/StatsAuthContext";
import "./StatsPage.css";

const API = import.meta.env.VITE_API_URL;

// Formate les secondes en "Xh Ymin"
function formatTime(seconds) {
  if (!seconds) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}min`;
  return `${h}h${m > 0 ? ` ${m}min` : ""}`;
}

// Formate les mètres en km
function formatDistance(meters) {
  if (!meters) return "—";
  return `${(meters / 1000).toFixed(1)} km`;
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div className={`stat-card ${accent ? "accent" : ""}`}>
      <span className="stat-card-label">{label}</span>
      <span className="stat-card-value">{value ?? "—"}</span>
      {sub && <span className="stat-card-sub">{sub}</span>}
    </div>
  );
}

function KdCircle({ kd }) {
  if (kd == null) return <div className="kd-circle empty">—</div>;
  const color = kd >= 1.5 ? "#22c55e" : kd >= 1 ? "#6366f1" : "#ef4444";
  const pct = Math.min(kd / 3, 1); // cercle plein à KD=3
  const dash = 2 * Math.PI * 38; // circumférence r=38
  return (
    <div className="kd-circle">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="38" fill="none" stroke="#1e1e2e" strokeWidth="8" />
        <circle
          cx="50" cy="50" r="38" fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={dash}
          strokeDashoffset={dash * (1 - pct)}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="kd-value" style={{ color }}>
        <span>{kd.toFixed(2)}</span>
        <small>K/D</small>
      </div>
    </div>
  );
}

function PlayerCard({ player, isMe }) {
  const hasIngame = player.kills != null;
  const appUrl = player.eva_app_username
    ? `https://app.eva.gg/profile/public/${player.eva_app_username}`
    : null;

  return (
    <div className={`player-card ${isMe ? "is-me" : ""}`}>
      {/* En-tête joueur */}
      <div className="player-card-header">
        <div className="player-card-name-block">
          <span className="player-card-name">{player.player_name}</span>
          {appUrl && (
            <a href={appUrl} target="_blank" rel="noopener noreferrer" className="player-app-link">
              profil EVA ↗
            </a>
          )}
        </div>
        {isMe && <span className="player-card-me">Vous</span>}
      </div>

      {/* Stats in-game */}
      {hasIngame ? (
        <div className="player-card-body">
          <div className="player-card-main">
            {/* Colonne gauche */}
            <div className="player-main-stats">
              <StatCard label="Parties" value={player.game_count} />
              <StatCard label="Victoires" value={player.game_victories} accent />
              <StatCard label="Défaites" value={player.game_defeats} />
              <StatCard label="Temps de jeu" value={formatTime(player.game_time)} />
            </div>

            {/* KD au centre */}
            <KdCircle kd={player.kd_ratio} />

            {/* Colonne droite */}
            <div className="player-main-stats right">
              <StatCard label="Kills" value={player.kills?.toLocaleString()} accent />
              <StatCard label="Morts" value={player.deaths?.toLocaleString()} />
              <StatCard label="Assists" value={player.assists?.toLocaleString()} />
              <StatCard label="Meilleure série" value={player.best_kill_streak} />
            </div>
          </div>

          {/* Ligne du bas */}
          <div className="player-card-footer">
            <div className="player-footer-stat">
              <span>Distance totale</span>
              <strong>{formatDistance(player.traveled_distance)}</strong>
            </div>
            <div className="player-footer-stat">
              <span>Win rate (app)</span>
              <strong>
                {player.game_count
                  ? `${((player.game_victories / player.game_count) * 100).toFixed(0)}%`
                  : "—"}
              </strong>
            </div>
            <div className="player-footer-stat">
              <span>Tournois circuit</span>
              <strong>{player.tournaments_played}</strong>
            </div>
            <div className="player-footer-stat">
              <span>Matchs compét. (V/D)</span>
              <strong>{player.wins}V / {player.losses}D</strong>
            </div>
          </div>
        </div>
      ) : (
        /* Pas encore de stats in-game */
        <div className="player-card-body no-ingame">
          <div className="player-circuit-stats">
            <StatCard label="Tournois" value={player.tournaments_played} />
            <StatCard label="Victoires" value={player.wins} accent />
            <StatCard label="Défaites" value={player.losses} />
            <StatCard label="Win rate" value={`${player.win_rate.toFixed(0)}%`} />
          </div>
          <p className="no-ingame-msg">
            Stats in-game non disponibles — pseudo EVA app non configuré
          </p>
        </div>
      )}
    </div>
  );
}

export default function StatsPage() {
  const { user, logout } = useStatsAuth();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/eclyps/players/`, { credentials: "include" })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setPlayers)
      .catch(() => setError("Impossible de charger les stats."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="stats-page">
      {/* Header */}
      <header className="stats-header">
        <div className="stats-header-left">
          <img src="/logo.png" alt="ECLYPS" className="stats-header-logo"
            onError={(e) => { e.target.style.display = "none"; }} />
          <div>
            <h1 className="stats-header-title">ECLYPS</h1>
            <p className="stats-header-sub">Espace équipe — statistiques</p>
          </div>
        </div>
        <div className="stats-header-right">
          <span className="stats-user-badge">👤 {user?.player_name || user?.username}</span>
          <button className="stats-logout-btn" onClick={logout}>Déconnexion</button>
        </div>
      </header>

      <main className="stats-main">
        {loading && (
          <div className="stats-skeleton-list">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="stats-skeleton-card" />)}
          </div>
        )}

        {error && (
          <div className="stats-error">⚠ {error}
            <button onClick={() => window.location.reload()}>Réessayer</button>
          </div>
        )}

        {!loading && !error && (
          <div className="players-grid">
            {players.map((p) => (
              <PlayerCard
                key={p.id}
                player={p}
                isMe={user?.player_name === p.player_name}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
