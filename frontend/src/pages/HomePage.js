import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../theme/homepage.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      {/* Header */}
      <header className="hp-header d-flex align-items-center justify-content-between px-4">
        <div className="hp-logo d-flex align-items-center">
          <img src="/images/logo.svg" alt="SecurePanel™" className="me-2" />
          <span className="h4 mb-0">SecurePanel™</span>
        </div>
        <nav>
          <ul className="nav">
            <li className="nav-item"><Link className="nav-link" to="/">Accueil</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/features">Fonctionnalités</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/pricing">Tarifs</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/support">Support</Link></li>
            <li className="nav-item">
              <button className="btn btn-primary ms-3" onClick={() => navigate("/login")}>
                Connexion
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero section */}
      <section className="hp-hero text-center text-white d-flex flex-column justify-content-center px-4">
        <h1 className="display-4 fw-bold">Gouvernance & Sécurité Cloud Zéro Confiance</h1>
        <p className="lead my-4">
          Surveillez, protégez et contrôlez vos environnements cloud depuis un portail centralisé.  
          Rapide à déployer, simple à utiliser, sécurisé par défaut.
        </p>
        <div>
          <Link to="/login" className="btn btn-lg btn-light me-2">Essayer gratuitement</Link>
          <Link to="/features" className="btn btn-lg btn-outline-light">En savoir plus</Link>
        </div>
      </section>

      {/* Features */}
      <section className="hp-features py-5 px-4">
        <div className="container">
          <h2 className="text-center mb-5">Fonctionnalités clés</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 text-center border-0 shadow-sm">
                <div className="card-body">
                  <div className="mb-3 feature-icon">📊</div>
                  <h5>Tableau de bord</h5>
                  <p className="text-muted">Indicateurs en temps réel, alertes et rapports détaillés.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 text-center border-0 shadow-sm">
                <div className="card-body">
                  <div className="mb-3 feature-icon">🔐</div>
                  <h5>Auth & MFA</h5>
                  <p className="text-muted">Authentification forte, journalisation granulaire des accès.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 text-center border-0 shadow-sm">
                <div className="card-body">
                  <div className="mb-3 feature-icon">☁️</div>
                  <h5>Stockage sécurisé</h5>
                  <p className="text-muted">Gestion de buckets, sauvegardes chiffrées et contrôle des téléchargements.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="hp-support bg-light py-5 px-4">
        <div className="container text-center">
          <h2>Besoin d’aide ?</h2>
          <p className="lead mb-4">
            Ouvrez un ticket auprès de notre équipe support, nous sommes là 24/7 pour vous assister.
          </p>
          <Link to="/support" className="btn btn-outline-primary btn-lg">
            Ouvrir un ticket
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="hp-footer bg-dark text-white text-center py-3">
        <div className="container">
          <small>© 2025 SecurePanel Inc. Tous droits réservés.</small>
          <div className="mt-2">
            <a href="/terms" className="text-white me-3">Mentions légales</a>
            <a href="/privacy" className="text-white">Confidentialité</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
