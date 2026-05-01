import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const validators = {
  equipe: (v) => v.trim().length < 2 ? "Le nom de l'équipe est requis." : null,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : "Adresse email invalide.",
  message: (v) => v.trim().length < 10 ? "Le message est trop court (10 caractères min)." : null,
};

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    document.title = "Contact — ECLYPS";
    return () => { document.title = "ECLYPS — Site officiel"; };
  }, []);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    if (validators[name]) {
      setFieldErrors((err) => ({ ...err, [name]: validators[name](value) }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (touched[name] && validators[name]) {
      setFieldErrors((err) => ({ ...err, [name]: validators[name](value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.target;
    const data = new FormData(form);

    const API_URL = import.meta.env.VITE_API_URL;
    const SITE_ID = import.meta.env.VITE_SITE_ID || "2";

    try {
      const response = await fetch(`${API_URL}/messages/public`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-site-id": SITE_ID,
        },
        body: JSON.stringify({
          name: data.get("equipe"),
          email: data.get("email"),
          subject: `Scrim ${data.get("format") || ""}`.trim(),
          content: data.get("message"),
        }),
      });

      if (response.ok || response.status === 201) {
        setSubmitted(true);
        setError(null);
        form.reset();
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Erreur HTTP: ${response.status}`);
      }
    } catch (err) {
      setError(
        err.message || "Impossible d'envoyer le message. Veuillez réessayer."
      );
      console.error("Message could not be sent:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-section">
      <div className="page-wrapper">
        <h2 className="page-title">Contact</h2>
        <p className="page-subtitle">Demande de scrim &amp; informations</p>
        <div className="divider"></div>

        <div className="contact-grid">
          <div className="form-card">
            <h3>⚔️ Demande de scrim</h3>

            {submitted ? (
              <div className="form-success">
                <span className="form-success-icon">✓</span>
                <h4>Message envoyé !</h4>
                <p>Merci pour votre demande. Nous reviendrons vers vous rapidement.</p>
                <button
                  type="button"
                  className="btn-submit"
                  onClick={() => setSubmitted(false)}
                  style={{ marginTop: "20px" }}
                >
                  Envoyer une autre demande
                </button>
              </div>
            ) : error ? (
              <div style={{ background: 'rgba(255,50,50,0.15)', border: '1px solid rgba(255,50,50,0.4)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', color: '#ff6b6b' }}>
                <strong>Erreur d'envoi :</strong> {error}
                <br /><small>Veuillez vérifier votre connexion internet ou réessayer plus tard.</small>
                <button type="button" style={{ display: 'block', marginTop: '0.5rem', background: 'transparent', border: '1px solid #ff6b6b', color: '#ff6b6b', padding: '0.25rem 0.75rem', borderRadius: '4px', cursor: 'pointer' }} onClick={() => setError(null)}>Réessayer</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="team">Votre équipe</label>
                  <input
                    id="team"
                    name="equipe"
                    type="text"
                    placeholder="Nom de votre équipe"
                    required
                    autoComplete="organization"
                    className={touched.equipe && fieldErrors.equipe ? "input-error" : ""}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.equipe && fieldErrors.equipe && (
                    <span className="field-error">{fieldErrors.equipe}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Votre email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="contact@votreequipe.com"
                    required
                    autoComplete="email"
                    className={touched.email && fieldErrors.email ? "input-error" : ""}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.email && fieldErrors.email && (
                    <span className="field-error">{fieldErrors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="format">Format souhaité</label>
                  <select id="format" name="format" defaultValue="">
                    <option value="">-- Choisir un format --</option>
                    <option value="3v3">3v3</option>
                    <option value="4v4">4v4</option>
                    <option value="5v5">5v5</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Disponibilités, arène, infos complémentaires..."
                    className={touched.message && fieldErrors.message ? "input-error" : ""}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.message && fieldErrors.message && (
                    <span className="field-error">{fieldErrors.message}</span>
                  )}
                </div>

                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? "Envoi en cours..." : "Envoyer la demande"}
                </button>
                <p className="form-legal-notice">
                  En soumettant ce formulaire, vous acceptez notre{" "}
                  <Link to="/politique-de-confidentialite">Politique de confidentialité</Link> et nos{" "}
                  <Link to="/mentions-legales">Mentions légales</Link>.
                </p>
              </form>
            )}
          </div>

          <div className="side-cards">
            <a
              href="https://www.instagram.com/eclyps_esport/"
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-card"
            >
              <div className="instagram-icon">
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
              </div>
              <div className="instagram-info">
                <h4>Instagram</h4>
                <p>Suivez notre actualité</p>
                <span>@eclyps_esport</span>
              </div>
            </a>

            <a href="mailto:contact@eclyps-esport.fr" className="email-card">
              <div className="email-icon">
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
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="email-info">
                <h4>Email</h4>
                <p>Contact direct</p>
                <span>contact@eclyps-esport.fr</span>
              </div>
            </a>

            <div className="info-card">
              <h4>⚔️ Infos scrim</h4>
              <p>
                Nous sommes une équipe basée à Caen, compétitive sur EVA After-H
                Battle Arena.
                <br />
                <br />
                Pour toute demande de scrim, merci de préciser votre format, vos
                disponibilités et votre arène habituelle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactPage;
