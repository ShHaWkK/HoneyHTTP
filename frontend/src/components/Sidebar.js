import React from "react";
import { Link } from "react-router-dom";
import "../theme/styles.css";

export default function Sidebar() {
  return (
    <aside className="sidebar bg-dark text-white p-3">
      <h5 className="text-light mb-4">🔐 SecurePanel</h5>

      <div className="mb-3">
        <strong className="text-secondary">Système</strong>
        <ul className="nav flex-column">
          <li><Link className="nav-link text-white" to="/dashboard">📊 Tableau de bord</Link></li>
          <li><Link className="nav-link text-white" to="/system/files">📁 Explorateur de fichiers</Link></li>
        </ul>
      </div>

      <div className="mb-3">
        <strong className="text-secondary">Surveillance</strong>
        <ul className="nav flex-column">
          <li><Link className="nav-link text-white" to="/system/logs">🧾 Journaux</Link></li>
          <li><Link className="nav-link text-white" to="/analytics">📈 Analytics</Link></li>
        </ul>
      </div>

      <div className="mb-3">
        <strong className="text-secondary">Sécurité</strong>
        <ul className="nav flex-column">
          <li><Link className="nav-link text-white" to="/security/mfa">🔐 MFA</Link></li>
          <li><Link className="nav-link text-white" to="/security/access-logs">📋 Accès</Link></li>
        </ul>
      </div>

      <div className="mb-3">
        <strong className="text-secondary">Paramètres</strong>
        <ul className="nav flex-column">
          <li><Link className="nav-link text-white" to="/settings/php-config">⚙️ PHP</Link></li>
        </ul>
      </div>

      <div className="mb-3">
        <strong className="text-secondary">Utilisateurs</strong>
        <ul className="nav flex-column">
          <li><Link className="nav-link text-white" to="/users">👥 Liste</Link></li>
          <li><Link className="nav-link text-white" to="/users/profile">👤 Profil</Link></li>
          <li><Link className="nav-link text-white" to="/users/chat">💬 Chat</Link></li>
        </ul>
      </div>

      <div className="mb-3">
        <strong className="text-secondary">Support</strong>
        <ul className="nav flex-column">
          <li><Link className="nav-link text-white" to="/support/tickets">📩 Tickets</Link></li>
        </ul>
      </div>
    </aside>
  );
}
