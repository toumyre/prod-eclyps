import { useEffect, useMemo, useRef, useState } from "react";
import Lightbox from "../components/Lightbox";
import { gallery_config } from "../data/const";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function GalleryPage() {
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lightbox
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Infinite scroll (up to 36), then pagination for the rest
  const [visibleCount, setVisibleCount] = useState(gallery_config.initialBatch);
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    document.title = "Galerie — ECLYPS";
    return () => { document.title = "ECLYPS — Site officiel"; };
  }, []);

  // Fetch from API
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        const SITE_ID = import.meta.env.VITE_SITE_ID || '2';
        const res = await fetch(`${API_URL}/gallery/public`, {
          headers: {
            "x-site-id": SITE_ID
          }
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

  const photos = useMemo(() => items.filter(item => item.type === 'photo'), [items]);
  const videos = useMemo(() => items.filter(item => item.type === 'video'), [items]);

  // Extract dynamic filters from photo categories
  const dynamicFilters = useMemo(() => {
    const categories = [...new Set(photos.map(p => p.category).filter(Boolean))];
    const defaultFilters = [{ id: "all", label: "Tout voir" }];
    const mappedCategories = categories.map(c => ({
      id: c,
      label: c.charAt(0).toUpperCase() + c.slice(1)
    }));
    return [...defaultFilters, ...mappedCategories];
  }, [photos]);

  const allFilteredPhotos = useMemo(() => {
    if (filter === "all") return photos;
    return photos.filter((p) => p.category === filter);
  }, [filter, photos]);

  const lightboxItems = useMemo(() => {
    return allFilteredPhotos.map(p => ({
      id: p.id,
      src: p.imageUrl,
      title: p.title,
      description: p.description
    }));
  }, [allFilteredPhotos]);

  const infiniteMax = gallery_config.infiniteScrollMax;
  const canInfiniteScroll =
    allFilteredPhotos.length > 0 &&
    visibleCount < Math.min(infiniteMax, allFilteredPhotos.length);

  const infinitePhotos = useMemo(() => {
    const cappedVisible = Math.min(
      visibleCount,
      infiniteMax,
      allFilteredPhotos.length,
    );
    return allFilteredPhotos.slice(0, cappedVisible);
  }, [allFilteredPhotos, visibleCount, infiniteMax]);

  const remainingPhotos = useMemo(() => {
    if (allFilteredPhotos.length <= infiniteMax) return [];
    return allFilteredPhotos.slice(infiniteMax);
  }, [allFilteredPhotos, infiniteMax]);

  const pageSize = gallery_config.pageSizeAfterInfinite;
  const totalPages = useMemo(() => {
    if (remainingPhotos.length === 0) return 0;
    return Math.ceil(remainingPhotos.length / pageSize);
  }, [remainingPhotos.length, pageSize]);

  const paginatedPhotos = useMemo(() => {
    if (remainingPhotos.length === 0) return [];
    const safePage = clamp(page, 1, totalPages || 1);
    const start = (safePage - 1) * pageSize;
    return remainingPhotos.slice(start, start + pageSize);
  }, [remainingPhotos, page, pageSize, totalPages]);

  const displayedPhotos = useMemo(() => {
    return [...infinitePhotos, ...paginatedPhotos];
  }, [infinitePhotos, paginatedPhotos]);

  const openLightboxById = (id) => {
    const index = lightboxItems.findIndex((photo) => photo.id === id);
    if (index !== -1) setLightboxIndex(index);
  };

  useEffect(() => {
    setVisibleCount(gallery_config.initialBatch);
    setPage(1);
    setLightboxIndex(null);
  }, [filter, items]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;
    if (!canInfiniteScroll) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;

        setVisibleCount((prev) => {
          const next = prev + gallery_config.batchSize;
          return Math.min(next, infiniteMax, allFilteredPhotos.length);
        });
      },
      { root: null, rootMargin: "600px 0px", threshold: 0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [canInfiniteScroll, allFilteredPhotos.length, infiniteMax]);

  useEffect(() => {
    if (totalPages === 0) {
      if (page !== 1) setPage(1);
      return;
    }
    const clamped = clamp(page, 1, totalPages);
    if (clamped !== page) {
      setPage(clamped);
    }
  }, [page, totalPages]);


  return (
    <section className="page-section">
      <div className="page-wrapper">
        <h2 className="page-title">Galerie</h2>
        <p className="page-subtitle">Photos & Vidéos</p>
        <div className="divider"></div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>Chargement...</div>
        ) : (
          <>
            {/* VIDEOS FIRST */}
            <div className="video-section">
              <h3 className="section-label">🎬 Vidéos</h3>
              <div className="section-divider"></div>

              {videos.length === 0 ? (
                <div className="video-placeholder">Aucune vidéo disponible.</div>
              ) : (
                <div className="video-grid">
                  {videos.map((video) => {
                    const isYouTube = video.videoUrl?.includes("youtube.com") || video.videoUrl?.includes("youtu.be");

                    return (
                      <div key={video.id} className="video-card">
                        {isYouTube ? (
                          <iframe
                            width="100%"
                            height="100%"
                            src={video.videoUrl.replace("watch?v=", "embed/")}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ border: "none", aspectRatio: "16/9", width: "100%", height: "auto", display: 'block' }}
                          ></iframe>
                        ) : video.videoUrl ? (
                          <video controls playsInline preload="metadata" poster={video.imageUrl} style={{ width: "100%", borderRadius: "8px" }}>
                            <source src={video.videoUrl} type="video/mp4" />
                          </video>
                        ) : (
                          <div className="video-placeholder">Lien indisponible</div>
                        )}
                        <div className="video-card-info" style={{ marginTop: '0.75rem' }}>
                          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 'bold' }}>{video.title}</h4>
                          {video.description && <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{video.description}</p>}
                          {video.category && <span style={{ display: 'inline-block', marginTop: '0.5rem', background: 'var(--brand-primary)', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{video.category}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* PHOTOS AFTER */}
            <h3 className="section-label" style={{ marginTop: '4rem' }}>📸 Photos</h3>
            <div className="section-divider"></div>

            <div className="filter-bar">
              {dynamicFilters.map((item) => (
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

            {displayedPhotos.length === 0 ? (
              <div className="video-placeholder">Aucune photo pour l'instant.</div>
            ) : (
              <div className="gallery-grid gallery-grid-3col">
                {displayedPhotos.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="gallery-item"
                    onClick={() => openLightboxById(item.id)}
                    style={{ cursor: 'pointer', border: 'none', background: 'transparent', padding: 0 }}
                  >
                    <img src={item.imageUrl} alt={item.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className="gallery-overlay">
                      <p>{item.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Infinite scroll sentinel */}
            <div ref={loadMoreRef} style={{ height: 1 }} />

            {/* Pagination after infinite section */}
            {remainingPhotos.length > 0 && totalPages > 0 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="lightbox-btn"
                  onClick={() => setPage((p) => clamp(p - 1, 1, totalPages))}
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
                  onClick={() => setPage((p) => clamp(p + 1, 1, totalPages))}
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

      <Lightbox
        items={lightboxItems}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex((prev) => (prev === null ? prev : prev === 0 ? lightboxItems.length - 1 : prev - 1))}
        onNext={() => setLightboxIndex((prev) => (prev === null ? prev : prev === lightboxItems.length - 1 ? 0 : prev + 1))}
      />
    </section>
  );
}

export default GalleryPage;
