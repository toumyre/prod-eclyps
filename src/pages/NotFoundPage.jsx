import { useEffect } from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
    useEffect(() => {
        document.title = "404 — ECLYPS";
        return () => { document.title = "ECLYPS — Site officiel"; };
    }, []);

    return (
        <section className="page-section">
            <div className="page-wrapper not-found-wrapper">
                <div className="not-found-content">
                    <div className="not-found-code">404</div>
                    <h2 className="page-title">Signal perdu</h2>
                    <p className="page-subtitle">
                        Cette page n&apos;existe pas ou a été déplacée.
                    </p>
                    <div className="divider"></div>
                    <p className="not-found-text">
                        L&apos;arène que tu cherches semble introuvable.
                        <br />
                        Retourne à la base pour retrouver ton chemin.
                    </p>
                    <Link className="btn-enter" to="/" style={{ marginTop: "30px", display: "inline-block" }}>
                        Retour à l&apos;accueil
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default NotFoundPage;
