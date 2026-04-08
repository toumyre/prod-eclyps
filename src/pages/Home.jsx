import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="eclipse-wrapper">
          <div className="gold-circle"></div>
          <div className="shadow-circle"></div>
        </div>

        <h1 className="hero-title">ECLYPS</h1>
        <p className="subtitle">Where Darkness Awakens</p>

        <div className="cta-container">
          <Link className="btn-enter" to="/team">
            Entrer dans l&apos;arène
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;
