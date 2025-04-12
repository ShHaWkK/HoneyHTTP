// 📁 frontend/src/pages/HomePage.js
import React from "react";
import { Link } from "react-router-dom";
import "../theme/homepage.css";

export default function HomePage() {
  return (
    <div className="homepage">
      <header className="homepage-header">
        <img src="/logo192.png" alt="SecurePanel" />
        <div className="actions">
          <Link to="/login" className="btn btn-outline-primary">
            Login to Dashboard
          </Link>
        </div>
      </header>

      <main className="homepage-main">
        <h1>Gestion centralisée de vos infrastructures sensibles</h1>
        <p>
          Accès sécurisé à vos environnements cloud, stockage distant, et outils de surveillance.
        </p>
        <Link to="/login" className="btn btn-primary mt-4">
          🔐 Connexion sécurisée
        </Link>
      </main>

      <footer className="homepage-footer text-center text-muted mt-5">
        © 2025 SecurePanel™ — CloudSec certified • ISO 27001 Ready
      </footer>
    </div>
  );
}
