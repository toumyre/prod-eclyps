import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function RosterPage() {
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Roster — ECLYPS";

    fetch(`${API_URL}/roster/public`, {
      headers: { "x-site-id": "2" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          setRoster([]);
        } else {
          setRoster(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch roster:", err);
        setRoster([]);
        setLoading(false);
      });

    return () => { document.title = "ECLYPS — Site officiel"; };
  }, []);

  return (
    <section className="page-section">
      <div className="page-wrapper">
        <h2 className="page-title">Roster</h2>
        <p className="page-subtitle">{roster.length} joueurs — Saison 2025</p>
        <div className="divider"></div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>Chargement...</div>
        ) : roster.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>Aucun joueur dans le roster.</div>
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
