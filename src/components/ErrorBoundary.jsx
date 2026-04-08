import { Component } from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="app" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ textAlign: "center", padding: "40px" }}>
                        <div style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: "4rem",
                            fontWeight: 900,
                            color: "var(--gold)",
                            letterSpacing: "8px",
                            marginBottom: "20px",
                        }}>
                            ERREUR
                        </div>
                        <p style={{
                            fontSize: "0.85rem",
                            color: "var(--grey)",
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            marginBottom: "30px",
                        }}>
                            Quelque chose s&apos;est mal passé. Recharge la page.
                        </p>
                        <Link
                            to="/"
                            className="btn-enter"
                            onClick={() => this.setState({ hasError: false })}
                        >
                            Retour à l&apos;accueil
                        </Link>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
