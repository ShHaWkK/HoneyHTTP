// 📁 frontend/src/components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";
import "../theme/styles.css";

export default function Sidebar() {
  return (
    <aside className="sidebar bg-dark text-white p-3">
      <h5 className="text-light mb-4">🔐 SecurePanel</h5>

      {/* System */}
      <div className="mb-3">
        <strong className="text-secondary">System</strong>
        <ul className="nav flex-column">
          <li><Link className="nav-link text-white" to="/dashboard">📊 Dashboard</Link></li>
          <li><Link className="nav-link text-white" to="/system/files">📁 File Explorer</Link></li>
        </ul>
      </div>

      {/* Monitoring */}
      <div className="mb-3">
        <strong className="text-secondary">Monitoring</strong>
        <ul className="nav flex-column">
          <li><Link className="nav-link text-white" to="/system/logs">🧾 Logs</Link></li>
          <li><Link className="nav-link text-white" to="/analytics">📈 Analytics</Link></li>
        </ul>
      </div>

      {/* Security */}
      <div className="mb-3">
        <strong className="text-secondary">Security</strong>
        <ul className="nav flex-column">
          <li><Link className="nav-link text-white" to="/security/mfa">🔐 MFA</Link></li>
          <li><Link className="nav-link text-white" to="/security/access-logs">🛡️ Access Logs</Link></li>
          <li><Link className="nav-link text-white" to="/security/access-token">🧾 JWT Access Token</Link></li>
        </ul>
      </div>

      {/* Settings */}
      <div className="mb-3">
        <strong className="text-secondary">Settings</strong>
        <ul className="nav flex-column">
          <li><Link className="nav-link text-white" to="/settings/php-config">📝 PHP Config</Link></li>
        </ul>
      </div>

      {/* Storage */}
      <div className="mb-3">
        <strong className="text-secondary">Storage</strong>
        <ul className="nav flex-column">
          <li><Link className="nav-link text-white" to="/storage/buckets">☁️ Buckets</Link></li>
        </ul>
      </div>

      {/* Users */}
      <div className="mb-3">
        <strong className="text-secondary">Users</strong>
        <ul className="nav flex-column">
          <li><Link className="nav-link text-white" to="/users">👥 Utilisateurs</Link></li>
          <li><Link className="nav-link text-white" to="/users/profile">👤 Mon profil</Link></li>
        </ul>
      </div>

      {/* Pièges divers */}
      <div className="mb-3">
        <strong className="text-secondary">Pièges</strong>
        <ul className="nav flex-column">
          <li><Link className="nav-link text-white" to="/auth/sso">🔓 SSO Portal</Link></li>
          <li><Link className="nav-link text-white" to="/xss">💬 Commentaires</Link></li>
          <li><Link className="nav-link text-white" to="/chat">💬 Chat Public</Link></li>
          <li><Link className="nav-link text-white" to="/admin-dump">🧾 Dump SQL</Link></li>
          <li><Link className="nav-link text-white" to="/admin-create">➕ Add Admin</Link></li>
          <li><Link className="nav-link text-white" to="/spy">🕵️ Admin Tracker</Link></li>
        </ul>
      </div>
    </aside>
  );
}
