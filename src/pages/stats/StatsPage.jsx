import { useState, useEffect } from "react";
import { useStatsAuth } from "../../contexts/StatsAuthContext";
import "./StatsPage.css";

const API = import.meta.env.VITE_API_URL;

// Colonnes triables du tableau
const COLUMNS = [
  { key: "player_name",        label: "Joueur" },
  { key: "tournaments_played", label: "Tournois" },
  { key: "matches_played",     label: "MJ" },
  { key: "wins",               label: "V" },
  { key: "losses",             label: "D" },
  { key: "win_rate",           label: "% Victoire" },
];

export default function StatsPage() {
  const { user, logout } = useStatsAuth();

  const [players, setPlayers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [sortKey, setSortKey]   = useState("wins");
  const [sortDir, setSortDir]   = useState("desc"); // "asc" ou "desc"
  const [lastSync, setLastSync] = useState(null);

  // Charger les stats au montage
  useEffect(() => {
    setLoading(true);
    fetch(`${API}/eclyps/players`, { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error("Erreur de chargement");
        return r.json();
      })
      .then((data) => {
        setPlayers(data);
        if (data.length > 0 && data[0].synced_at) {
          setLastSync(new Date(data[0].synced_at));
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Tri du tableau : clic sur une colonne → trie par cette colonne
  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const sorted = [...players].sort((a, b) => {
    const va = a[sortKey];
    const vb = b[sortKey];
    if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    return sortDir === "asc" ? va - vb : vb - va;
  });

  // Calculs globaux pour l'équipe
  const totalWins   = players.reduce((s, p) => s + p.wins, 0);
  const totalLosses = players.reduce((s, p) => s + p.losses, 0);
  const teamWinRate = (totalWins + totalLosses) > 0
    ? ((totalWins / (totalWins + totalLosses)) * 100).toFixed(0)
    : "—";

  return (
    <div className="stats-page">
      {/* ── Header ── */}
      <header className="stats-header">
        <div className="stats-header-left">
          <img src="/logo.png" alt="ECLYPS" className="stats-header-logo"
            onError={(e) => { e.target.style.display = "none"; }} />
          <div>
            <h1 className="stats-header-title">ECLYPS</h1>
            <p className="stats-header-sub">Statistiques équipe</p>
          </div>
        </div>
        <div className="stats-header-right">
          <span className="stats-user-badge">👤 {user?.player_name || user?.username}</span>
          <button className="stats-logout-btn" onClick={logout}>Déconnexion</button>
        </div>
      </header>

      <main className="stats-main">
        {/* ── Cards résumé équipe ── */}
        <section className="stats-summary">
          <div className="stats-summary-card">
            <span className="summary-label">Joueurs</span>
            <span className="summary-value">{players.length}</span>
          </div>
          <div className="stats-summary-card win">
            <span className="summary-label">Victoires équipe</span>
            <span className="summary-value">{totalWins > 0 ? Math.max(...players.map(p => p.wins)) : "—"}</span>
          </div>
          <div className="stats-summary-card">
            <span className="summary-label">% Victoire max</span>
            <span className="summary-value">{players.length > 0 ? `${Math.max(...players.map(p => p.win_rate)).toFixed(0)}%` : "—"}</span>
          </div>
          <div className="stats-summary-card">
            <span className="summary-label">Dernière sync</span>
            <span className="summary-value summary-date">
              {lastSync ? lastSync.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) : "—"}
            </span>
          </div>
        </section>

        {/* ── Tableau stats ── */}
        <section className="stats-table-section">
          <div className="stats-table-header">
            <h2>Roster — Statistiques individuelles</h2>
            <p className="stats-table-info">
              Données synchronisées automatiquement depuis <a href="https://competitive.eva.gg" target="_blank" rel="noopener noreferrer">competitive.eva.gg</a>
            </p>
          </div>

          {loading && (
            <div className="stats-skeleton-list">
              {[1, 2, 3, 4, 5].map((i) => <div key={i} className="stats-skeleton-row" />)}
            </div>
          )}

          {error && (
            <div className="stats-error">
              ⚠ Impossible de charger les stats. <button onClick={() => window.location.reload()}>Réessayer</button>
            </div>
          )}

          {!loading && !error && players.length === 0 && (
            <div className="stats-empty">
              Aucun joueur synchronisé pour le moment.<br />
              Lance <code>uv run python scripts/sync_eva_players.py</code> sur ct-api.
            </div>
          )}

          {!loading && !error && players.length > 0 && (
            <div className="stats-table-wrapper">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th className="col-rank">#</th>
                    {COLUMNS.map((col) => (
                      <th
                        key={col.key}
                        className={`sortable ${sortKey === col.key ? "active" : ""}`}
                        onClick={() => handleSort(col.key)}
                      >
                        {col.label}
                        <span className="sort-icon">
                          {sortKey === col.key ? (sortDir === "asc" ? " ↑" : " ↓") : " ↕"}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((player, idx) => (
                    <tr key={player.id} className={`stats-row ${player.username === user?.username ? "is-me" : ""}`}>
                      <td className="col-rank">{idx + 1}</td>
                      <td className="col-name">
                        <span className="player-name">{player.player_name}</span>
                        {player.eva_user_id && (
                          <a
                            href={`https://competitive.eva.gg/en_GB/player/${player.eva_user_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="player-eva-link"
                            title="Voir le profil EVA"
                          >EVA</a>
                        )}
                      </td>
                      <td>{player.tournaments_played}</td>
                      <td>{player.matches_played}</td>
                      <td className="col-win">{player.wins}</td>
                      <td className="col-loss">{player.losses}</td>
                      <td>
                        <div className="winrate-bar-wrapper">
                          <div className="winrate-track">
                            <div
                              className="winrate-bar"
                              style={{ width: `${Math.min(player.win_rate, 100)}%` }}
                            />
                          </div>
                          <span className="winrate-label">{player.win_rate.toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
