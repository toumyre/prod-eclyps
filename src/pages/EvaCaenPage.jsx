import { useEffect, useMemo, useState } from "react";
import Lightbox from "../components/Lightbox";
import { evacaenAssets, galleryItems } from "../data/gallery";

function EvaCaenPage() {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const lightboxItems = useMemo(
    () => galleryItems.filter((item) => item.src),
    [],
  );

  useEffect(() => {
    document.title = "EVA Caen — ECLYPS";
    return () => { document.title = "ECLYPS — Site officiel"; };
  }, []);

  return (
    <section className="page-section">
      <div className="page-wrapper">
        <h2 className="page-title">EVA Caen</h2>
        <p className="page-subtitle">Notre arène — Caen, Normandie</p>
        <div className="divider"></div>

        <div className="identity-section">
          <div className="identity-text">
            <h3>🏟️ L&apos;arène</h3>
            <p>
              <span>EVA Caen</span> est l&apos;arène de réalité virtuelle où est
              née l&apos;équipe ECLYPS. C&apos;est ici, que tout a commencé.
            </p>
            <p>
              <span>EVA</span> propose une expérience de jeu immersive unique,
              avec des sessions libres et des <span>ligues compétitives</span>{" "}
              organisées régulièrement.
            </p>
            <p>
              Que tu sois débutant ou joueur confirmé, EVA Caen t&apos;accueille
              pour vivre le <span>FPS en réalité virtuelle</span> comme nulle
              part ailleurs.
            </p>

            <div className="links-row">
              <a
                href="https://www.eva.gg/fr-FR/locations/caen-14"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link"
              >
                🌐 Site officiel EVA Caen
              </a>
              <a
                href="https://discord.gg/SAwPrfGSYr"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link"
              >
                💬 Discord EVA Caen
              </a>
              <a
                href="https://www.instagram.com/eva_caen14/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link"
              >
                📸 Instagram EVA Caen
              </a>
              <a
                href="https://competitive.eva.gg/fr/tournaments/2444249435255949311/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link"
              >
                🏆 EVA Competitive
              </a>
            </div>
          </div>

          <div className="identity-photo">
            <img src="/img/evacaen1.jpg" alt="Arène EVA Caen" />
          </div>
        </div>

        <div className="info-banner">
          <div className="info-item">
            <h4>📍 Adresse</h4>
            <p>
              <span>EVA Caen</span>
              <br />
              20 Rue Michel Tournier
              <br />
              14120 Mondeville, Normandie
            </p>
          </div>
          <div className="info-item">
            <h4>🕹️ Format de jeu</h4>
            <p>
              <span>EVA After-H</span>
              <br />
              Moon Of The Dead
              <br />
              EVA KARTING GP (prochainement)
            </p>
          </div>
          <div className="info-item">
            <h4>🏆 Compétition</h4>
            <p>
              <span>JARL League</span>
              <br />
            </p>
          </div>
        </div>

        <div className="gallery-grid evacaen-grid">
          {evacaenAssets.map((item) => (
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
                <div className="gallery-placeholder">🎮</div>
              )}
            </button>
          ))}
        </div>

        <div className="discord-banner">
          <div className="discord-banner-text">
            <h3>💬 Rejoins la communauté</h3>
            <p>
              La scène EVA Caen est active sur Discord. Retrouve les annonces de{" "}
              <span>matchs</span>, les résultats de la <span>JARL League</span>{" "}
              et connecte-toi avec les autres joueurs de la région.
            </p>
          </div>
          <a
            href="https://discord.gg/SAwPrfGSYr"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-link"
          >
            💬 Rejoindre le Discord
          </a>
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

export default EvaCaenPage;
