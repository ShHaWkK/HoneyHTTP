// 📁 frontend/src/pages/SpyAdmin.js
import React, { useEffect, useState } from "react";

export default function SpyAdmin() {
  const [tokens, setTokens] = useState([]);
  const [logs, setLogs] = useState([]);

  const loadData = async () => {
    const rawTokens = await fetch("http://localhost:8080/tokens").then(res => res.text());
    const rawLogs = await fetch("http://localhost:8080/trackings").then(res => res.text());

    setTokens(rawTokens.split("\n").filter(Boolean));
    setLogs(rawLogs.split("\n").filter(Boolean));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">🔎 User Activity Monitor</h2>
      <p className="text-muted">Surveille les comportements suspects dans les sessions actives.</p>

      {/* JWT Tokens Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title">JWT Token Interactions</h5>
          {tokens.length === 0 ? (
            <div className="text-muted">No token usage detected.</div>
          ) : (
            <ul className="list-group">
              {tokens.map((line, idx) => (
                <li key={idx} className="list-group-item small font-monospace text-break">
                  {line}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Behavior Tracking */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Behavioral Activity Logs</h5>
          <p className="text-muted small">Mouvements, clics, frappe clavier... (filtrés automatiquement)</p>
          <div style={{ maxHeight: "350px", overflowY: "auto" }} className="bg-light p-2 rounded">
            <ul className="list-unstyled mb-0 small font-monospace">
              {logs.slice(-50).map((entry, idx) => (
                <li key={idx}>{entry}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
