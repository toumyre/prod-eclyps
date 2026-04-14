import { useEffect, useMemo, useState } from "react";
import Lightbox from "../components/Lightbox";
import { galleryItems, videoItems, teamAssets } from "../data/gallery";

function TeamPage() {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const lightboxItems = useMemo(
    () => galleryItems.filter((item) => item.src),
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
              <span>ECLYPS</span> est née en <span>2025</span>.<br />
              Nous sommes une bande d&apos;amis, nous avons commencé par des
              sessions fun puis, cela s&apos;est rapidement transformé en une
              vraie équipe esport compétitive.
            </p>
            <p>
              On se retrouve au bar, mais dans l&apos;arène,{" "}
              <span>on donne tout</span>. C&apos;est ça, l&apos;esprit ECLYPS :
              une ambiance authentique au service d&apos;un jeu compétitif.
            </p>
            <p></p>
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
