import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useStatsAuth } from "../../contexts/StatsAuthContext";
import "./StatsPage.css";

const API = import.meta.env.VITE_API_URL;

// ── Helpers de formatage ──────────────────────────────────────────────────────

function formatTime(seconds) {
  if (!seconds) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}min`;
  return `${h}h${m > 0 ? ` ${m}min` : ""}`;
}

function formatDistance(meters) {
  if (!meters) return "—";
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatRelativeTime(isoString) {
  if (!isoString) return null;
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 2) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin}min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `il y a ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `il y a ${diffD}j`;
}

function formatDate(isoString) {
  if (!isoString) return "—";
  const d = new Date(isoString);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

// ── Options de tri ────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: "kd",    label: "K/D",              get: (p) => p.kd_ratio ?? -1 },
  { value: "kills", label: "Kills",             get: (p) => p.kills ?? -1 },
  { value: "wins",  label: "Victoires circuit", get: (p) => p.wins ?? -1 },
  { value: "games", label: "Parties",           get: (p) => p.game_count ?? -1 },
];

// ── Composants de stats ───────────────────────────────────────────────────────

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
  const color = kd >= 1.5 ? "#d4af37" : kd >= 1 ? "#c0c0c0" : "#888888";
  const pct   = Math.min(kd / 3, 1);
  const dash  = 2 * Math.PI * 38;
  return (
    <div className="kd-circle">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
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

// ── Traduction des champs EVA ─────────────────────────────────────────────────

function translateOutcome(outcome) {
  if (!outcome) return "—";
  if (outcome === "Victory") return "Victoire";
  if (outcome === "Defeat")  return "Défaite";
  if (outcome === "Draw")    return "Égalité";
  return outcome;
}

function translateMode(mode) {
  if (!mode) return "—";
  if (mode === "Domination")   return "Domination";
  if (mode === "Elimination")  return "Élimination";
  if (mode === "Team")         return "Équipe";
  return mode;
}

function formatDuration(seconds) {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ── Modal plein écran — Dernières parties ────────────────────────────────────

function GamesModal({ player, onClose }) {
  const [games, setGames]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    fetch(`${API}/eclyps/players/${player.id}/games`, { credentials: "include" })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setGames)
      .catch(() => setError(true))
      .finally(() => setLoading(false));

    // Bloquer le scroll du body pendant l'ouverture
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [player.id]);

  // Fermer sur Echap
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return createPortal(
    <div className="games-modal-overlay" onClick={onClose}>
      <div className="games-modal" onClick={(e) => e.stopPropagation()}>
        {/* En-tête modal */}
        <div className="games-modal-header">
          <div className="games-modal-title">
            DERNIÈRES PARTIES&nbsp;: <span>AFTER-H</span>
          </div>
          <div className="games-modal-player">{player.player_name}</div>
          <button className="games-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Contenu */}
        {loading && <div className="games-modal-state">Chargement…</div>}
        {error   && <div className="games-modal-state">Impossible de charger les parties.</div>}
        {!loading && !error && (!games || games.length === 0) && (
          <div className="games-modal-state">Aucune partie disponible pour cette saison.</div>
        )}

        {!loading && !error && games && games.length > 0 && (
          <div className="games-table-wrap">
            {/* En-têtes */}
            <div className="games-thead">
              <span>Mode</span>
              <span>Joueurs</span>
              <span>Carte</span>
              <span>K / D / A</span>
              <span>Résultat</span>
              <span>Date</span>
              <span>Heure</span>
            </div>

            {/* Lignes */}
            {games.map((g) => {
              const date  = g.date ? new Date(g.date) : null;
              const isWin = g.outcome === "Victory";
              return (
                <div key={g.id} className={`games-row ${isWin ? "win" : "loss"}`}>
                  <span className="games-cell-mode">{translateMode(g.mode)}</span>
                  <span className="games-cell-center">{g.nb_players ?? "—"}</span>
                  <span className="games-cell-map">{g.map ?? "—"}</span>
                  <span className="games-cell-kda">
                    <strong>{g.kills ?? "—"}</strong>
                    {" / "}
                    <span className="games-deaths">{g.deaths ?? "—"}</span>
                    {" / "}
                    <span>{g.assists ?? "—"}</span>
                  </span>
                  <span className={`games-cell-outcome ${isWin ? "win" : "loss"}`}>
                    {translateOutcome(g.outcome)}
                  </span>
                  <span className="games-cell-date">
                    {date
                      ? date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
                      : "—"}
                  </span>
                  <span className="games-cell-time">
                    {date
                      ? date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
                      : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

// ── Panneau historique de progression ────────────────────────────────────────

function HistoryPanel({ playerId }) {
  const [snapshots, setSnapshots] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    fetch(`${API}/eclyps/players/${playerId}/history`, { credentials: "include" })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setSnapshots)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [playerId]);

  if (loading) return <div className="history-loading">Chargement…</div>;
  if (error)   return <div className="history-empty">Impossible de charger l'historique.</div>;
  if (!snapshots || snapshots.length === 0)
    return <div className="history-empty">Aucun historique disponible pour l'instant.</div>;

  // On calcule les deltas en comparant snapshot[i] avec snapshot[i+1] (plus ancien)
  return (
    <div className="history-panel">
      <div className="history-timeline">
        {snapshots.map((snap, i) => {
          const prev = snapshots[i + 1]; // snapshot plus ancien
          const deltaGames = prev ? (snap.game_count ?? 0) - (prev.game_count ?? 0) : null;
          const deltaKills = prev ? (snap.kills ?? 0) - (prev.kills ?? 0) : null;
          const kdColor    = snap.kd_ratio >= 1.5 ? "#d4af37" : snap.kd_ratio >= 1 ? "#c0c0c0" : "#888888";

          return (
            <div key={snap.id} className="history-entry">
              {/* Ligne de temps */}
              <div className="history-dot" style={{ background: kdColor }} />
              <div className="history-content">
                <div className="history-date">{formatDate(snap.snapshot_at)}</div>
                <div className="history-stats">
                  {/* K/D */}
                  <span className="history-kd" style={{ color: kdColor }}>
                    {snap.kd_ratio?.toFixed(2) ?? "—"} K/D
                  </span>
                  {/* Stats brutes */}
                  <span className="history-stat">{snap.game_count} parties</span>
                  <span className="history-stat">{snap.kills?.toLocaleString()} kills</span>
                  <span className="history-stat">{formatTime(snap.game_time)}</span>
                </div>
                {/* Deltas (si on a un snapshot précédent) */}
                {prev && (
                  <div className="history-deltas">
                    {deltaGames > 0 && (
                      <span className="history-delta-pos">+{deltaGames} partie{deltaGames > 1 ? "s" : ""}</span>
                    )}
                    {deltaKills > 0 && (
                      <span className="history-delta-pos">+{deltaKills?.toLocaleString()} kills</span>
                    )}
                    {prev.kd_ratio != null && snap.kd_ratio != null && (
                      <span className={`history-delta-kd ${snap.kd_ratio >= prev.kd_ratio ? "pos" : "neg"}`}>
                        K/D {prev.kd_ratio.toFixed(2)} → {snap.kd_ratio.toFixed(2)}
                      </span>
                    )}
                  </div>
                )}
                {/* Premier snapshot = baseline */}
                {!prev && (
                  <div className="history-baseline">Point de départ (baseline)</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Card joueur ───────────────────────────────────────────────────────────────

function PlayerCard({ player, isMe }) {
  const hasIngame  = player.kills != null;
  const hasGames   = player.eva_app_user_id != null;
  const appUrl     = player.eva_app_username
    ? `https://app.eva.gg/profile/public/${player.eva_app_username}`
    : null;
  const syncLabel  = formatRelativeTime(player.synced_at);
  const [showGamesModal, setShowGamesModal] = useState(false);

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
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {player.season_number && (
            <span className="player-card-season">S{player.season_number}</span>
          )}
          {isMe && <span className="player-card-me">Vous</span>}
        </div>
      </div>

      {/* Stats in-game */}
      {hasIngame ? (
        <div className="player-card-body">
          <div className="player-card-main">
            <div className="player-main-stats">
              <StatCard label="Parties"      value={player.game_count} />
              <StatCard label="Victoires"    value={player.game_victories} accent />
              <StatCard label="Défaites"     value={player.game_defeats} />
              <StatCard label="Temps de jeu" value={formatTime(player.game_time)} />
            </div>
            <KdCircle kd={player.kd_ratio} />
            <div className="player-main-stats right">
              <StatCard label="Kills"           value={player.kills?.toLocaleString()} accent />
              <StatCard label="Morts"           value={player.deaths?.toLocaleString()} />
              <StatCard label="Assists"         value={player.assists?.toLocaleString()} />
              <StatCard label="Meilleure série" value={player.best_kill_streak} />
            </div>
          </div>

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
              <span>Matchs compét.</span>
              <strong>{player.wins}V / {player.losses}D</strong>
            </div>
          </div>

          {/* Barre inférieure : synchro + bouton dernières parties */}
          {hasGames && (
            <div className="player-card-actions">
              {syncLabel && <span className="player-card-sync">Synchro {syncLabel}</span>}
              <button
                className="history-toggle-btn"
                onClick={() => setShowGamesModal(true)}
              >
                Dernières parties
              </button>
            </div>
          )}

          {/* Modal plein écran */}
          {showGamesModal && (
            <GamesModal player={player} onClose={() => setShowGamesModal(false)} />
          )}
        </div>
      ) : (
        <div className="player-card-body no-ingame">
          <div className="player-circuit-stats">
            <StatCard label="Tournois"  value={player.tournaments_played} />
            <StatCard label="Victoires" value={player.wins} accent />
            <StatCard label="Défaites"  value={player.losses} />
            <StatCard label="Win rate"  value={`${player.win_rate.toFixed(0)}%`} />
          </div>
          <p className="no-ingame-msg">
            Stats in-game non disponibles — pseudo EVA app non configuré
          </p>
        </div>
      )}
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────

export default function StatsPage() {
  const { user, logout }        = useStatsAuth();
  const [players, setPlayers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [sortBy, setSortBy]     = useState("kd");

  useEffect(() => {
    const prev = document.title;
    document.title = "ECLYPS — Espace équipe";
    return () => { document.title = prev; };
  }, []);

  useEffect(() => {
    fetch(`${API}/eclyps/players/`, { credentials: "include" })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setPlayers)
      .catch(() => setError("Impossible de charger les stats."))
      .finally(() => setLoading(false));
  }, []);

  const sortedPlayers = useMemo(() => {
    const opt = SORT_OPTIONS.find((o) => o.value === sortBy);
    if (!opt) return players;
    return [...players].sort((a, b) => opt.get(b) - opt.get(a));
  }, [players, sortBy]);

  return (
    <div className="stats-page">
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
        {!loading && !error && players.length > 0 && (
          <div className="stats-sort-bar">
            <span className="stats-sort-label">Trier par</span>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`stats-sort-btn ${sortBy === opt.value ? "active" : ""}`}
                onClick={() => setSortBy(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="stats-skeleton-list">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="stats-skeleton-card" />)}
          </div>
        )}

        {error && (
          <div className="stats-error">
            ⚠ {error}
            <button onClick={() => window.location.reload()}>Réessayer</button>
          </div>
        )}

        {!loading && !error && (
          <div className="players-grid">
            {sortedPlayers.map((p) => (
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
