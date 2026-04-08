import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { NavLink, Outlet, Link } from "react-router-dom";
import { navLinks } from "../data/const";
import AnalyticsTracker from "./AnalyticsTracker";
import "../App.css";

function MenuToggle({ isOpen, onClick }) {
  return (
    <button
      className="menu-toggle"
      onClick={onClick}
      aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
      aria-expanded={isOpen}
      type="button"
    >
      <span
        style={{
          transform: isOpen ? "rotate(45deg) translate(9px, 5px)" : "none",
        }}
      ></span>
      <span style={{ opacity: isOpen ? "0" : "1" }}></span>
      <span
        style={{
          transform: isOpen ? "rotate(-45deg) translate(9px, -5px)" : "none",
        }}
      ></span>
    </button>
  );
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      className={`scroll-to-top ${visible ? "visible" : ""}`}
      onClick={scrollUp}
      aria-label="Retour en haut"
      type="button"
    >
      ↑
    </button>
  );
}

class Star {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = (Math.random() - 0.5) * window.innerWidth * 2;
    this.y = (Math.random() - 0.5) * window.innerHeight * 2;
    this.z = initial ? Math.random() * window.innerWidth : window.innerWidth;
  }

  update() {
    this.z -= 0.5;
    if (this.z < 1) this.reset();
  }

  draw(ctx, width, height) {
    const depth = 1 - this.z / width;
    const sx = (this.x / this.z) * (width / 2) + width / 2;
    const sy = (this.y / this.z) * (height / 2) + height / 2;
    const r = Math.max(0.1, depth * 2.5);

    ctx.shadowBlur = 15 * depth;
    ctx.shadowColor = "white";
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            ECLYPS
          </Link>
          <p className="footer-tagline">Where Darkness Awakens</p>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <h4>Navigation</h4>
          <ul>
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to}>{link.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer-socials">
          <h4>Suivez-nous</h4>
          <div className="footer-social-links">
            <a
              href="https://www.instagram.com/eclyps_esport/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram ECLYPS"
              className="footer-social-link"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <circle cx="17.5" cy="6.5" r="1.5"></circle>
              </svg>
            </a>
            <a
              href="mailto:contact@eclyps-esport.fr"
              aria-label="Email ECLYPS"
              className="footer-social-link"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ECLYPS — Tous droits réservés</p>
        <div className="footer-legal">
          <Link to="/mentions-legales">Mentions légales</Link>
          <span>·</span>
          <Link to="/politique-de-confidentialite">Confidentialité</Link>
        </div>
        <p className="footer-arena">Équipe EVA basée à Caen, Normandie</p>
      </div>
    </footer>
  );
}

function Layout() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const canvas = document.getElementById("starsCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const numStars = 150;
    const stars = [];

    for (let i = 0; i < numStars; i += 1) {
      stars.push(new Star());
    }

    let rafId = null;
    const animate = () => {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);
      stars.forEach((star) => {
        star.update();
        star.draw(ctx, width, height);
      });
      rafId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="app">
      <canvas id="starsCanvas" />
      <header className="site-header">
        <Link className="logo logo-link" to="/">
          ECLYPS
        </Link>
        {menuOpen && (
          <div
            className="mobile-overlay"
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}
        <nav
          className={`site-nav ${menuOpen ? "active" : ""}`}
          aria-label="Navigation principale"
        >
          <ul>
            <li>
              <a
                href="https://www.instagram.com/eclyps_esport/"
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-link"
                title="Suivez-nous sur Instagram"
                aria-label="Instagram ECLYPS"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <circle cx="17.5" cy="6.5" r="1.5"></circle>
                </svg>
              </a>
            </li>
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? "active" : undefined
                  }
                  onClick={closeMenu}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <MenuToggle isOpen={menuOpen} onClick={toggleMenu} />
      </header>

      <main>
        <Outlet />
      </main>

      <Footer />
      <AnalyticsTracker />
      <ScrollToTop />
    </div>
  );
}

export default Layout;
