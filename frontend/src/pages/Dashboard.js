import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  useEffect(() => {
    document.title = "Tableau de bord • SecurePanel";
    // Simuler des alertes temps-réel
    const messages = [
      "🔔 Tentative de brute-force bloquée",
      "🔔 Nouveau ticket de support (#1024)",
      "🔔 MFA activée pour user123"
    ];
    let i = 0;
    const iv = setInterval(() => {
      setAlerts((a) => [messages[i % messages.length], ...a].slice(0, 5));
      i++;
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="container mt-4">
      <h2>Bienvenue sur SecurePanel™</h2>
      <div className="mt-3">
        {alerts.map((m, i) => (
          <div key={i} className="alert alert-warning small">
            {m}
          </div>
        ))}
      </div>

      <div className="row g-4 mt-3">
        {[
          { title: "Sessions actives", value: 128, clr: "primary" },
          { title: "Utilisateurs", value: 32, clr: "success" },
          { title: "Erreurs", value: 2, clr: "danger" },
        ].map((s) => (
          <div key={s.title} className="col-md-4">
            <div className={`card border-${s.clr}`}>
              <div className="card-body text-center">
                <h3 className={`text-${s.clr}`}>{s.value}</h3>
                <p className="mb-0">{s.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <a href="/support/tickets" className="btn btn-outline-secondary">
          📩 Ouvrir un ticket
        </a>
      </div>
    </div>
  );
}
