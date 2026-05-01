import { useEffect } from "react";

function PolitiqueConfidentialite() {
    useEffect(() => {
        document.title = "Politique de confidentialité — ECLYPS";
        return () => { document.title = "ECLYPS — Site officiel"; };
    }, []);

    return (
        <section className="page-section">
            <div className="page-wrapper">
                <h2 className="page-title">Politique de confidentialité</h2>
                <p className="page-subtitle">Protection de vos données personnelles</p>
                <div className="divider"></div>

                <div className="legal-content">
                    <div className="legal-section">
                        <h3>1. Responsable du traitement</h3>
                        <p>
                            Le responsable du traitement des données collectées sur ce site est :
                        </p>
                        <ul>
                            <li><strong>Nom :</strong> ETENDARD Tommy</li>
                            <li><strong>Email :</strong> etendardtommy@gmail.com</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h3>2. Données collectées</h3>
                        <p>
                            Nous collectons uniquement les données que vous nous transmettez
                            volontairement via le <strong>formulaire de contact</strong> :
                        </p>
                        <ul>
                            <li>Nom de votre équipe</li>
                            <li>Adresse email</li>
                            <li>Format de jeu souhaité</li>
                            <li>Message libre</li>
                        </ul>
                        <p>
                            Des <strong>données de navigation anonymes</strong> (page visitée,
                            horodatage) sont collectées automatiquement à des fins de statistiques
                            internes. Aucun cookie n&apos;est déposé et aucune donnée personnelle
                            n&apos;est associée à ces visites.
                        </p>
                    </div>

                    <div className="legal-section">
                        <h3>3. Finalité du traitement</h3>
                        <p>
                            Vos données sont utilisées exclusivement pour :
                        </p>
                        <ul>
                            <li>Répondre à vos demandes de scrim</li>
                            <li>Vous recontacter par email</li>
                        </ul>
                        <p>
                            Vos données ne sont <strong>jamais vendues, cédées ou partagées</strong> à
                            des tiers à des fins commerciales.
                        </p>
                    </div>

                    <div className="legal-section">
                        <h3>4. Base légale</h3>
                        <p>
                            Le traitement est fondé sur votre <strong>consentement</strong> :
                            en soumettant le formulaire de contact, vous acceptez que vos
                            données soient traitées conformément à cette politique.
                        </p>
                    </div>

                    <div className="legal-section">
                        <h3>5. Hébergement des données</h3>
                        <p>
                            Les données soumises via le formulaire de contact sont transmises
                            et stockées sur un serveur auto-hébergé (Raspberry Pi, France),
                            sans recours à un service tiers. Aucune donnée n&apos;est transmise
                            en dehors de ce serveur.
                        </p>
                    </div>

                    <div className="legal-section">
                        <h3>6. Durée de conservation</h3>
                        <p>
                            Vos données sont conservées pendant une durée maximale de{" "}
                            <strong>12 mois</strong> à compter de votre demande, puis
                            supprimées.
                        </p>
                    </div>

                    <div className="legal-section">
                        <h3>7. Vos droits</h3>
                        <p>
                            Conformément au Règlement Général sur la Protection des Données
                            (RGPD) et à la loi Informatique et Libertés, vous disposez des
                            droits suivants :
                        </p>
                        <ul>
                            <li><strong>Droit d&apos;accès :</strong> obtenir une copie de vos données</li>
                            <li><strong>Droit de rectification :</strong> corriger des données inexactes</li>
                            <li><strong>Droit de suppression :</strong> demander l&apos;effacement de vos données</li>
                            <li><strong>Droit d&apos;opposition :</strong> vous opposer au traitement</li>
                            <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
                        </ul>
                        <p>
                            Pour exercer ces droits, contactez-nous à :{" "}
                            <a href="mailto:contact@eclyps-esport.fr">
                                contact@eclyps-esport.fr
                            </a>
                        </p>
                        <p>
                            En cas de litige, vous pouvez adresser une réclamation à la{" "}
                            <a
                                href="https://www.cnil.fr/fr/plaintes"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                CNIL
                            </a>{" "}
                            (Commission Nationale de l&apos;Informatique et des Libertés).
                        </p>
                    </div>

                    <div className="legal-section">
                        <h3>8. Cookies</h3>
                        <p>
                            Ce site <strong>n&apos;utilise aucun cookie</strong> et ne dépose
                            aucun traceur sur votre appareil. Aucune bannière de consentement
                            n&apos;est donc nécessaire.
                        </p>
                    </div>

                    <div className="legal-section">
                        <h3>9. Mise à jour</h3>
                        <p>
                            Cette politique peut être modifiée à tout moment. La dernière mise
                            à jour date du <strong>28 février 2026</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PolitiqueConfidentialite;
