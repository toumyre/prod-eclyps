import { useEffect, useMemo, useState } from "react";
import Lightbox from "../components/Lightbox";
import { videoItems, teamAssets } from "../data/gallery";

function TeamPage() {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const lightboxItems = useMemo(
    () => teamAssets.filter((item) => item.src),
    [],
  );

  useEffect(() => {
    document.title = "L'Équipe — ECLYPS";
    return () => { document.title = "ECLYPS — Site officiel"; };
  }, []);

  return (
    <section className="page-section">
      <div className="page-wrapper">
        <h2 className="page-title">L&apos;Équipe</h2>
        <p className="page-subtitle">Since 2025 — EVA Caen</p>
        <div className="divider"></div>

        <div className="identity-section">
          <div className="identity-text">
            <h3>Qui sommes-nous?</h3>
            <p>
              <span>ECLYPS</span> s&apos;est créée en <span>2025</span>.
              Avec d&apos;anciens joueurs comme <span>Getty</span> et{" "}
              <span>Titboyyy</span>, on a fondé une équipe d&apos;amis avec
              un seul objectif : <span>aller le plus loin possible</span>.
            </p>
            <p>
              Toujours dans la bonne ambiance — on traîne parfois au bar,
              mais <span>in-game, on se donne pour la victoire</span>. 🙂
            </p>
          </div>
          <div className="identity-video">
            {videoItems.length > 0 ? (
              <video controls playsInline loop preload="metadata">
                <source src={videoItems[0].src} type="video/mp4" />
              </video>
            ) : (
              <div className="video-placeholder">
                Vidéos bientôt disponibles
              </div>
            )}
          </div>
        </div>

        <div className="league-banner">
          <img
            src="/img/jarl-league.jpg"
            alt="EVA JARL League"
            className="league-logo"
          />
          <div className="league-info">
            <h3>🏆 Notre compétition</h3>
            <p>
              ECLYPS évolue dans la <span>EVA JARL League</span>, la ligue
              compétitive organisée par l&apos;arène <span>EVA Caen</span>. Un
              format structuré qui rassemble les meilleures équipes de la région
              normande pour des affrontements au plus haut niveau local.
            </p>
          </div>
        </div>

        <h3 className="gallery-title">📸 Dans les coulisses</h3>
        <div className="section-divider"></div>
        <div className="gallery-grid two-by-two">
          {teamAssets.map((item) => (
            <button
              key={item.id}
              type="button"
              className="gallery-item"
              onClick={() => {
                const index = lightboxItems.findIndex(
                  (photo) => photo.id === item.id,
                );
                if (index !== -1) setLightboxIndex(index);
              }}
            >
              {item.src ? (
                <img src={item.src} alt={item.title} loading="lazy" />
              ) : (
                <div className="gallery-placeholder">📷</div>
              )}
            </button>
          ))}
        </div>
      </div>

      <Lightbox
        items={lightboxItems}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() =>
          setLightboxIndex((prev) =>
            prev === 0 ? lightboxItems.length - 1 : prev - 1,
          )
        }
        onNext={() =>
          setLightboxIndex((prev) =>
            prev === lightboxItems.length - 1 ? 0 : prev + 1,
          )
        }
      />
    </section>
  );
}

export default TeamPage;
