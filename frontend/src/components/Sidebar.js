import React from "react";
import { Link } from "react-router-dom";
import "../theme/styles.css";

export default function Sidebar() {
  return (
    <aside className="sidebar bg-dark text-white p-3">
      <h5 className="text-light mb-4">🔐 SecurePanel</h5>
      
      <div className="mb-3">
        <strong className="text-secondary">System</strong>
        <ul className="nav flex-column">
          <li><Link className="nav-link text-white" to="/dashboard">📊 Dashboard</Link></li>
          <li><Link className="nav-link text-white" to="/system/files">📁 File Explorer</Link></li>
          <li><Link className="nav-link text-white" to="/config">⚙️ Config</Link></li>
          <li><Link className="nav-link text-white" to="/config-editor">📝 PHP Config</Link></li>
          <li><Link className="nav-link text-white" to="/system/logs">📋 Logs</Link></li>
        </ul>
      </div>

      <div className="mb-3">
        <strong className="text-secondary">Security</strong>
        <ul className="nav flex-column">
          <li><Link className="nav-link text-white" to="/auth/token-preview">🔑 Token Viewer</Link></li>
          <li><Link className="nav-link text-white" to="/portal/secure-access">🔓 OAuth Portal</Link></li>
          <li><Link className="nav-link text-white" to="/xss">💬 Comments (XSS)</Link></li>
        </ul>
      </div>

      <div className="mb-3">
        <strong className="text-secondary">Users</strong>
        <ul className="nav flex-column">
          <li><Link className="nav-link text-white" to="/users">👥 Users</Link></li>
          <li><Link className="nav-link text-white" to="/admin-create">➕ Add Admin</Link></li>
        </ul>
      </div>

      <div className="mb-3">
        <strong className="text-secondary">Cloud</strong>
        <ul className="nav flex-column">
          <li><Link className="nav-link text-white" to="/cloud">☁️ Buckets</Link></li>
        </ul>
      </div>
    </aside>
  );
}
