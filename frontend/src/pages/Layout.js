import React, { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./../theme/styles.css";

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    const page = location.pathname.replace("/", "") || "Dashboard";
    document.title = `Admin Honeypot • ${page}`;
  }, [location]);

  return (
    <div className="d-flex flex-column vh-100">
      {/* Header */}
      <header className="bg-primary text-white p-3 d-flex justify-content-between align-items-center">
        <h4 className="m-0">🛡️ Admin Honeypot</h4>
        <span className="small">Session active</span>
      </header>

      {/* Main layout */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <aside className="bg-dark text-white p-3" style={{ width: "220px" }}>
          <ul className="nav flex-column">
            <li><Link className="nav-link text-white" to="/dashboard">📊 Dashboard</Link></li>
            <li><Link className="nav-link text-white" to="/explorer">📁 File Explorer</Link></li>
            <li><Link className="nav-link text-white" to="/editor">📝 PHP Editor</Link></li>
            <li><Link className="nav-link text-white" to="/database">🗄️ Database</Link></li>
            <li><Link className="nav-link text-white" to="/logs">📋 Logs</Link></li>
            <li><Link className="nav-link text-white" to="/config">⚙️ Config</Link></li>
            <li><Link className="nav-link text-white" to="/chat">💬 Chat</Link></li>
            <li><Link className="nav-link text-white" to="/phish-page">🔓 Portal</Link></li>
          </ul>
        </aside>

        {/* Content */}
        <main className="p-4 flex-grow-1 bg-light">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="text-center text-muted p-2 bg-white border-top small">
        © 2025 Admin Honeypot — Cybersecurity Simulation
      </footer>
    </div>
  );
}
