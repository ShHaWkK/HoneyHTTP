import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../theme/homepage.css";

export default function HomePage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="homepage">
      <header className="homepage-header bg-white shadow-sm p-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img src="images/logo.jpg" alt="SecurePanel" style={{ width: "40px" }} className="me-2" />
          <h4 className="m-0 text-primary">SecurePanel™</h4>
        </div>
        <nav>
          <button className="btn btn-outline-primary" onClick={handleLogin}>
            Connexion
          </button>
        </nav>
      </header>

      <main className="homepage-main text-center py-5">
        <h1 className="display-5 fw-bold">Gouvernance Cloud & Sécurité Zéro Confiance</h1>
        <p className="lead text-muted mt-3">
          Gérez vos environnements cloud, vos identités, vos accès et vos configurations depuis un seul point de contrôle.
        </p>
        <div className="mt-4">
          <Link to="/login" className="btn btn-lg btn-primary">
            🔐 Connexion sécurisée
          </Link>
        </div>

        {/* Features */}
        <section className="container mt-5">
          <h3>🧰 Fonctionnalités clés</h3>
          <div className="row mt-4">
            <div className="col-md-4">
              <h5>📊 Dashboard centralisé</h5>
              <p className="text-muted">Suivi en temps réel de l'état du système et des indicateurs de sécurité.</p>
            </div>
            <div className="col-md-4">
              <h5>🔐 MFA & Access Logs</h5>
              <p className="text-muted">Double authentification, contrôle granulaire des jetons et journalisation.</p>
            </div>
            <div className="col-md-4">
              <h5>💾 Stockage sécurisé</h5>
              <p className="text-muted">Sauvegardes chiffrées, buckets isolés et traçabilité des accès.</p>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="bg-light py-4 mt-5">
          <div className="container">
            <h4>🔒 Certifié pour la conformité</h4>
            <p className="text-muted">
              Conforme aux standards ISO/IEC 27001, RGPD et CloudSec-Ready.
            </p>
            <div className="d-flex justify-content-center gap-4 mt-3">
              <img src="images/cert1.png" alt="ISO27001" height="40" />
              <img src="images/cert2.png" alt="RGPD" height="40" />
              <img src="images/cert3.png" alt="CloudSec" height="40" />
            </div>
          </div>
        </section>
      </main>

      <footer className="homepage-footer bg-white border-top mt-5 py-3 text-center text-muted small">
        © 2025 SecurePanel Inc. • Powered by SecureOps™ • Simulated SaaS Infrastructure
      </footer>
    </div>
  );
}
