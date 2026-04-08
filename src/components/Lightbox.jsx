import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function Lightbox({ items = [], index = null, onClose, onPrev, onNext }) {
  const current = index !== null ? items[index] : null;
  const [isZoomed, setIsZoomed] = useState(false);

  // Reset zoom when switching images
  useEffect(() => {
    setIsZoomed(false);
  }, [index]);

  // Keyboard navigation: Escape, ArrowLeft, ArrowRight
  useEffect(() => {
    if (index === null) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          e.preventDefault();
          onPrev();
          break;
        case "ArrowRight":
          e.preventDefault();
          onNext();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [index, onClose, onPrev, onNext]);

  if (!current) return null;

  const toggleZoom = (event) => {
    event.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  return createPortal(
    <div className="lightbox active" onClick={onClose} role="dialog" aria-modal="true" aria-label="Visionneuse d'images">
      <button
        className="lightbox-close"
        type="button"
        onClick={onClose}
        aria-label="Fermer la visionneuse"
      >
        ✕
      </button>
      <img
        src={current.src}
        alt={current.title || "Image en plein écran"}
        onClick={toggleZoom}
        style={{
          maxWidth: isZoomed ? "none" : "95vw",
          maxHeight: isZoomed ? "none" : "95vh",
          width: isZoomed ? "auto" : "auto",
          height: isZoomed ? "auto" : "auto",
          cursor: isZoomed ? "zoom-out" : "zoom-in",
          transition: "all 0.3s ease",
        }}
      />
      {current.title && <p id="lightbox-caption">{current.title}</p>}
      <div
        className="lightbox-nav"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="lightbox-btn" type="button" onClick={onPrev} aria-label="Image précédente">
          ← Précédent
        </button>
        <span className="lightbox-counter">
          {index + 1} / {items.length}
        </span>
        <button className="lightbox-btn" type="button" onClick={onNext} aria-label="Image suivante">
          Suivant →
        </button>
      </div>
      <p
        style={{ fontSize: "0.7rem", color: "var(--grey)", marginTop: "10px" }}
      >
        {isZoomed ? "🔍 Clic pour réduire" : "🔍 Clic pour agrandir"} — ← → pour naviguer — Echap pour fermer
      </p>
    </div>,
    document.body
  );
}

export default Lightbox;
