// 📁 frontend/src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Dashboard() {
  const [response, setResponse] = useState("");
  const sessionId = Date.now(); // Identifiant session pour le tracking

  useEffect(() => {
    document.title = "Admin Dashboard • Secure Panel";
  }, []);

  const triggerTracking = async (event, detail) => {
    await fetch("http://localhost:8080/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, detail, session: sessionId }),
    });
  };

  const handleAction = (action) => {
    triggerTracking("dashboard_action", action);
    setResponse(`✅ Action '${action}' triggered`);
  };

  return (
    <div className="container mt-4">
      <h1>Welcome to SecurePanel™</h1>
      <p className="text-muted">Centralized admin portal for cloud infrastructure.</p>

      <div className="row">
        {/* Colonne 1 : Session + Actions */}
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Session</h5>
              <div className="alert alert-info">
                {localStorage.getItem("jwt") ? (
                  <>
                    JWT Token active:<br />
                    <code>{localStorage.getItem("jwt")}</code>
                  </>
                ) : (
                  "No token found."
                )}
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Quick Actions</h5>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-danger" onClick={() => handleAction("Download Backup ZIP")}>
                  📦 Télécharger backup.zip
                </button>
                <button className="btn btn-outline-secondary" onClick={() => handleAction("Flush Logs")}>
                  🧹 Purger les logs
                </button>
                <button className="btn btn-outline-warning" onClick={() => handleAction("Reset Database")}>
                  🛠️ Réinitialiser DB
                </button>
                <button className="btn btn-outline-info" onClick={() => handleAction("Enable WebShield")}>
                  🛡️ Activer WebShield
                </button>
                <button className="btn btn-outline-success" onClick={() => handleAction("Enable MFA")}>
                  🔐 Activer MFA
                </button>
                <button className="btn btn-outline-dark" onClick={() => handleAction("Generate audit report")}>
                  🧬 Générer rapport d’audit
                </button>
              </div>
              {response && <div className="alert alert-success mt-3">{response}</div>}
            </div>
          </div>
        </div>

        {/* Colonne 2 : État système + sécurité */}
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">System Status</h5>
              <ul className="list-group">
                <li className="list-group-item">🔒 Encryption: <span className="text-success">Active</span></li>
                <li className="list-group-item">📡 Network: <span className="text-success">OK</span></li>
                <li className="list-group-item">🧠 AI Security: <span className="text-success">Online</span></li>
                <li className="list-group-item">📈 CPU Load: <span className="text-warning">Moderate</span></li>
              </ul>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Security Insights</h5>
              <ul className="list-group">
                <li className="list-group-item">🛡️ MFA Status: <span className="text-danger">Not enabled</span></li>
                <li className="list-group-item">🔓 Last breach attempt: <span className="text-danger">4h ago</span></li>
                <li className="list-group-item">🔐 JWTs issued: <span className="text-muted">12</span></li>
                <li className="list-group-item">🧪 Recent audit score: <span className="text-success">92%</span></li>
              </ul>
            </div>
          </div>

          <div className="text-center small text-muted mt-3">
            ✅ CloudSec certified • ISO 27001 Ready
          </div>
        </div>
      </div>
    </div>
  );
}
