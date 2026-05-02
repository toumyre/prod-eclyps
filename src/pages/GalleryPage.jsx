import { useEffect, useMemo, useRef, useState } from "react";
import Lightbox from "../components/Lightbox";
import { gallery_config } from "../data/const";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function getYouTubeThumbnail(url) {
  const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

function getYouTubeEmbedUrl(url) {
  const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url;
}

function GalleryPage() {
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  const [lightboxIndex, setLightboxIndex] = useState(null);

  const [visibleCount, setVisibleCount] = useState(gallery_config.initialBatch);
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    document.title = "Galerie — ECLYPS";
    return () => { document.title = "ECLYPS — Site officiel"; };
  }, []);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        const SITE_ID = import.meta.env.VITE_SITE_ID || '2';
        const res = await fetch(`${API_URL}/gallery/public`, {
          headers: { "x-site-id": SITE_ID }
        });
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        }
      } catch (err) {
        console.error("Failed to load gallery data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const hasVideos = useMemo(() => items.some(i => i.type === 'video'), [items]);

  const dynamicFilters = useMemo(() => {
    const photos = items.filter(i => i.type === 'photo');
    const categories = [...new Set(photos.map(p => p.category).filter(Boolean))];
    const base = [{ id: "all", label: "Tout voir" }];
    if (hasVideos) base.push({ id: "video", label: "Vidéos" });
    const mapped = categories.map(c => ({ id: c, label: c.charAt(0).toUpperCase() + c.slice(1) }));
    return [...base, ...mapped];
  }, [items, hasVideos]);

  const allFilteredItems = useMemo(() => {
    let list;
    if (filter === "all") list = items;
    else if (filter === "video") list = items.filter(i => i.type === 'video');
    else list = items.filter(i => i.category === filter);
    return [...list].sort((a, b) => {
      const da = a.created_at || a.date || '1970-01-01';
      const db = b.created_at || b.date || '1970-01-01';
      return db.localeCompare(da);
    });
  }, [filter, items]);

  const lightboxItems = useMemo(() => {
    return allFilteredItems
      .filter(i => i.type === 'photo')
      .map(p => ({ id: p.id, src: p.image_url, title: p.title, description: p.description }));
  }, [allFilteredItems]);

  const infiniteMax = gallery_config.infiniteScrollMax;
  const canInfiniteScroll = allFilteredItems.length > 0 && visibleCount < Math.min(infiniteMax, allFilteredItems.length);

  const infiniteItems = useMemo(() => {
    return allFilteredItems.slice(0, Math.min(visibleCount, infiniteMax, allFilteredItems.length));
  }, [allFilteredItems, visibleCount, infiniteMax]);

  const remainingItems = useMemo(() => {
    if (allFilteredItems.length <= infiniteMax) return [];
    return allFilteredItems.slice(infiniteMax);
  }, [allFilteredItems, infiniteMax]);

  const pageSize = gallery_config.pageSizeAfterInfinite;
  const totalPages = useMemo(() => {
    if (remainingItems.length === 0) return 0;
    return Math.ceil(remainingItems.length / pageSize);
  }, [remainingItems.length, pageSize]);

  const paginatedItems = useMemo(() => {
    if (remainingItems.length === 0) return [];
    const safePage = clamp(page, 1, totalPages || 1);
    const start = (safePage - 1) * pageSize;
    return remainingItems.slice(start, start + pageSize);
  }, [remainingItems, page, pageSize, totalPages]);

  const displayedItems = useMemo(() => [...infiniteItems, ...paginatedItems], [infiniteItems, paginatedItems]);

  const openLightboxById = (id) => {
    const index = lightboxItems.findIndex(p => p.id === id);
    if (index !== -1) setLightboxIndex(index);
  };

  useEffect(() => {
    setVisibleCount(gallery_config.initialBatch);
    setPage(1);
    setLightboxIndex(null);
    setActiveVideo(null);
  }, [filter, items]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !canInfiniteScroll) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisibleCount(prev => Math.min(prev + gallery_config.batchSize, infiniteMax, allFilteredItems.length));
      },
      { root: null, rootMargin: "600px 0px", threshold: 0 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [canInfiniteScroll, allFilteredItems.length, infiniteMax]);

  useEffect(() => {
    if (totalPages === 0) { if (page !== 1) setPage(1); return; }
    const clamped = clamp(page, 1, totalPages);
    if (clamped !== page) setPage(clamped);
  }, [page, totalPages]);

  // Close video modal on Escape
  useEffect(() => {
    if (!activeVideo) return;
    const onKey = (e) => { if (e.key === "Escape") setActiveVideo(null); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeVideo]);

  return (
    <section className="page-section">
      <div className="page-wrapper">
        <h2 className="page-title">Galerie</h2>
        <p className="page-subtitle">Photos & Vidéos</p>
        <div className="divider"></div>

        {loading ? (
          <div className="gallery-grid gallery-grid-3col">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: "1", borderRadius: 4 }} />
            ))}
          </div>
        ) : (
          <>
            <div className="filter-bar">
              {dynamicFilters.map(item => (
                <button
                  key={item.id}
                  type="button"
                  className={`filter-btn ${filter === item.id ? "active" : ""}`}
                  onClick={() => setFilter(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {displayedItems.length === 0 ? (
              <div className="video-placeholder">Aucun contenu pour l'instant.</div>
            ) : (
              <div className="gallery-grid gallery-grid-3col">
                {displayedItems.map(item => {
                  if (item.type === 'video') {
                    const thumb = item.image_url || getYouTubeThumbnail(item.video_url);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className="gallery-item"
                        onClick={() => setActiveVideo(item)}
                        style={{ cursor: 'pointer', border: 'none', background: 'transparent', padding: 0 }}
                      >
                        {thumb
                          ? <img src={thumb} alt={item.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div className="gallery-placeholder" />
                        }
                        <div className="gallery-video-badge">▶</div>
                        <div className="gallery-overlay">
                          <p>{item.title}</p>
                        </div>
                      </button>
                    );
                  }
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className="gallery-item"
                      onClick={() => openLightboxById(item.id)}
                      style={{ cursor: 'pointer', border: 'none', background: 'transparent', padding: 0 }}
                    >
                      <img src={item.image_url} alt={item.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div className="gallery-overlay">
                        <p>{item.title}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div ref={loadMoreRef} style={{ height: 1 }} />

            {remainingItems.length > 0 && totalPages > 0 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="lightbox-btn"
                  onClick={() => setPage(p => clamp(p - 1, 1, totalPages))}
                  disabled={page <= 1}
                  style={{ opacity: page <= 1 ? 0.4 : 1, cursor: page <= 1 ? "not-allowed" : "pointer" }}
                >
                  ← Page précédente
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--grey)", letterSpacing: "2px", textTransform: "uppercase", fontSize: "0.75rem" }}>
                  Page {page} / {totalPages}
                </div>
                <button
                  type="button"
                  className="lightbox-btn"
                  onClick={() => setPage(p => clamp(p + 1, 1, totalPages))}
                  disabled={page >= totalPages}
                  style={{ opacity: page >= totalPages ? 0.4 : 1, cursor: page >= totalPages ? "not-allowed" : "pointer" }}
                >
                  Page suivante →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Video modal */}
      {activeVideo && (
        <div className="video-modal-backdrop" onClick={() => setActiveVideo(null)}>
          <div className="video-modal-content" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close"
              onClick={() => setActiveVideo(null)}
              aria-label="Fermer"
            >
              ✕
            </button>
            {activeVideo.video_url?.includes("youtube.com") || activeVideo.video_url?.includes("youtu.be") ? (
              <iframe
                src={getYouTubeEmbedUrl(activeVideo.video_url)}
                title={activeVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ aspectRatio: "16/9", width: "100%", height: "auto", display: "block", border: "none", borderRadius: 4 }}
              />
            ) : (
              <video controls autoPlay playsInline style={{ width: "100%", borderRadius: 4 }}>
                <source src={activeVideo.video_url} type="video/mp4" />
              </video>
            )}
            {activeVideo.title && (
              <p className="video-modal-title">{activeVideo.title}</p>
            )}
          </div>
        </div>
      )}

      <Lightbox
        items={lightboxItems}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex(prev => prev === null ? prev : prev === 0 ? lightboxItems.length - 1 : prev - 1)}
        onNext={() => setLightboxIndex(prev => prev === null ? prev : prev === lightboxItems.length - 1 ? 0 : prev + 1)}
      />
    </section>
  );
}

export default GalleryPage;
