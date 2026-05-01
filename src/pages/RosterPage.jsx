import { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function PlayerCardSkeleton() {
  return (
    <div className="player-card" style={{ pointerEvents: "none" }}>
      <div className="skeleton" style={{ width: 36, height: 18, marginBottom: 8, borderRadius: 3 }} />
      <div className="player-photo-container">
        <div className="skeleton" style={{ width: "100%", aspectRatio: "3/4", borderRadius: 4 }} />
      </div>
      <div className="player-info" style={{ padding: "1rem" }}>
        <div className="skeleton" style={{ width: "60%", height: 18, margin: "0 auto", borderRadius: 3 }} />
      </div>
    </div>
  );
}

function RosterPage() {
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchRoster = useCallback(() => {
    setLoading(true);
    setError(false);
    fetch(`${API_URL}/roster/public`, { headers: { "x-site-id": "2" } })
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((data) => {
        setRoster(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch roster:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    document.title = "Roster — ECLYPS";
    fetchRoster();
    return () => { document.title = "ECLYPS — Site officiel"; };
  }, [fetchRoster]);

  return (
    <section className="page-section">
      <div className="page-wrapper">
        <h2 className="page-title">Roster</h2>
        <p className="page-subtitle">
          {!loading && !error ? `${roster.length} joueurs — ` : ""}Saison 2026
        </p>
        <div className="divider"></div>

        {loading ? (
          <div className="roster-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <PlayerCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="api-error">
            <p>Impossible de charger le roster.</p>
            <button type="button" className="btn-retry" onClick={fetchRoster}>
              Réessayer
            </button>
          </div>
        ) : roster.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--grey)" }}>
            Aucun joueur dans le roster.
          </div>
        ) : (
          <div className="roster-grid">
            {roster.map((player) => (
              <div key={player.id} className="player-card">
                {player.number && <span className="player-number">{player.number}</span>}
                <div className="player-photo-container">
                  {player.photo_url ? (
                    <img
                      src={player.photo_url}
                      alt={player.name}
                      className="player-photo"
                      loading="lazy"
                    />
                  ) : (
                    <div className="player-photo-placeholder">🎮</div>
                  )}
                </div>
                <div className="player-info">
                  <h3 className="player-name">{player.name}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default RosterPage;
