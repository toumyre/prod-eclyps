import { useEffect } from "react";

function MentionsLegales() {
    useEffect(() => {
        document.title = "Mentions légales — ECLYPS";
        return () => { document.title = "ECLYPS — Site officiel"; };
    }, []);

    return (
        <section className="page-section">
            <div className="page-wrapper">
                <h2 className="page-title">Mentions légales</h2>
                <p className="page-subtitle">Informations réglementaires</p>
                <div className="divider"></div>

                <div className="legal-content">
                    <div className="legal-section">
                        <h3>1. Éditeur du site</h3>
                        <p>
                            Le site <strong>eclyps-esport.fr</strong> est édité par :
                        </p>
                        <ul>
                            <li><strong>Responsable :</strong> ETENDARD Tommy — éditeur non professionnel</li>
                            <li><strong>Email :</strong> etendardtommy@gmail.com</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h3>2. Directeur de la publication</h3>
                        <p>ETENDARD Tommy — etendardtommy@gmail.com</p>
                    </div>

                    <div className="legal-section">
                        <h3>3. Hébergement</h3>
                        <p>
                            Ce site est hébergé sur un serveur personnel (auto-hébergement).
                        </p>
                        <ul>
                            <li><strong>Type :</strong> Serveur dédié auto-hébergé</li>
                            <li><strong>Contact :</strong> etendardtommy@gmail.com</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h3>4. Propriété intellectuelle</h3>
                        <p>
                            L&apos;ensemble des contenus présents sur ce site (textes, images, logos,
                            vidéos, éléments graphiques) est la propriété exclusive de
                            l&apos;éditeur, sauf mention contraire.
                        </p>
                        <p>
                            Toute reproduction, représentation, modification ou adaptation de
                            tout ou partie du site sans autorisation écrite préalable est
                            strictement interdite.
                        </p>
                    </div>

                    <div className="legal-section">
                        <h3>5. Limitation de responsabilité</h3>
                        <p>
                            L&apos;éditeur s&apos;efforce de fournir des informations exactes et à
                            jour. Toutefois, il ne saurait être tenu responsable des erreurs,
                            omissions ou résultats obtenus suite à l&apos;utilisation de ces
                            informations.
                        </p>
                        <p>
                            Les liens hypertextes présents sur le site peuvent renvoyer vers
                            des sites tiers. L&apos;éditeur décline toute responsabilité quant au
                            contenu de ces sites externes.
                        </p>
                    </div>

                    <div className="legal-section">
                        <h3>6. Crédits</h3>
                        <p>
                            Site développé avec React et Vite.
                            <br />
                            Polices : Inter &amp; Rajdhani (Google Fonts).
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MentionsLegales;
