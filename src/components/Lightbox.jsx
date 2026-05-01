import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function Lightbox({ items = [], index = null, onClose, onPrev, onNext }) {
  const current = index !== null ? items[index] : null;
  const [isZoomed, setIsZoomed] = useState(false);
  const touchStartX = useRef(null);

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

    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      if (touchStartX.current === null) return;
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? onNext() : onPrev();
      }
      touchStartX.current = null;
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
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
