import { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const ECLYPS_LOGO = "https://competitive.eva.gg/media/file/2448735900902178804/logo_medium";

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ResultBadge({ result }) {
  if (!result) return null;
  const map = { win: ["V", "#2e7d32"], loss: ["D", "#b71c1c"], draw: ["N", "#555"] };
  const [label, color] = map[result] || ["?", "#555"];
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: 3,
      background: color,
      color: "#fff",
      fontSize: "0.75rem",
      fontWeight: 700,
      letterSpacing: 2,
      textTransform: "uppercase",
    }}>
      {label}
    </span>
  );
}

function MatchCardSkeleton() {
  return (
    <div className="match-card">
      <div className="skeleton" style={{ width: "30%", height: 14, borderRadius: 3, marginBottom: 12 }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div className="skeleton" style={{ width: "35%", height: 20, borderRadius: 3 }} />
        <div className="skeleton" style={{ width: 60, height: 28, borderRadius: 4 }} />
        <div className="skeleton" style={{ width: "35%", height: 20, borderRadius: 3 }} />
      </div>
    </div>
  );
}

function SchedulePage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState("upcoming");

  const fetchMatches = useCallback(() => {
    setLoading(true);
    setError(false);
    fetch(`${API_URL}/matches/public`, { headers: { "x-site-id": "2" } })
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((data) => {
        setMatches(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch matches:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    document.title = "Calendrier — ECLYPS";
    fetchMatches();
    return () => { document.title = "ECLYPS — Site officiel"; };
  }, [fetchMatches]);

  const upcoming = matches.filter((m) => m.status !== "completed");
  const results = matches.filter((m) => m.status === "completed");
  const displayed = tab === "upcoming" ? upcoming : results;

  return (
    <section className="page-section">
      <div className="page-wrapper">
        <h2 className="page-title">Calendrier & Résultats</h2>
        <p className="page-subtitle">JARL League — Saison 2026</p>
        <div className="divider"></div>

        <div className="schedule-tabs">
          <button
            type="button"
            className={`filter-btn ${tab === "upcoming" ? "active" : ""}`}
            onClick={() => setTab("upcoming")}
          >
            À venir {!loading && `(${upcoming.length})`}
          </button>
          <button
            type="button"
            className={`filter-btn ${tab === "results" ? "active" : ""}`}
            onClick={() => setTab("results")}
          >
            Résultats {!loading && `(${results.length})`}
          </button>
        </div>

        {loading ? (
          <div style={{ marginTop: "2rem" }}>
            {Array.from({ length: 4 }).map((_, i) => <MatchCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="api-error">
            <p>Impossible de charger les matchs.</p>
            <button type="button" className="btn-retry" onClick={fetchMatches}>
              Réessayer
            </button>
          </div>
        ) : displayed.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--grey)" }}>
            {tab === "upcoming" ? "Aucun match à venir." : "Aucun résultat disponible."}
          </div>
        ) : (
          <div style={{ marginTop: "2rem" }}>
            {displayed.map((match) => {
              const date = formatDate(match.played_at || match.scheduled_at);
              const hasScore = match.score_eclyps != null && match.score_opponent != null;
              return (
                <div key={match.id} className="match-card">
                  <div className="match-meta">
                    {match.division && <span className="match-division">{match.division}</span>}
                    {date && <span className="match-date">{date}</span>}
                    <span className={`match-status match-status--${match.status}`}>
                      {match.status === "completed" ? "Terminé" : match.status === "running" ? "En cours" : "À venir"}
                    </span>
                  </div>
                  <div className="match-row">
                    <span className="match-team match-team--us">
                      ECLYPS
                      <img src={ECLYPS_LOGO} alt="ECLYPS" className="opponent-logo" />
                    </span>
                    <div className="match-center">
                      {hasScore ? (
                        <span className="match-score">
                          {match.score_eclyps} <span className="match-score-sep">—</span> {match.score_opponent}
                        </span>
                      ) : (
                        <span className="match-score match-score--vs">VS</span>
                      )}
                      {match.result && <ResultBadge result={match.result} />}
                    </div>
                    <span className="match-team match-team--opponent">
                      {match.opponent_name}
                      {match.opponent_logo_url && (
                        <img
                          src={match.opponent_logo_url}
                          alt={match.opponent_name}
                          className="opponent-logo"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default SchedulePage;
