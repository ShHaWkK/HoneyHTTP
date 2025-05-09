import React, { useEffect, useState } from "react";

export default function Analytics() {
  const [stats, setStats] = useState({ ip: {}, ua: {} });

  useEffect(() => {
    // Simuler récupération de trackings
    const mock = [
      { ip: "10.0.0.5", ua: "Chrome" },
      { ip: "10.0.0.5", ua: "Chrome" },
      { ip: "10.0.0.7", ua: "Firefox" },
      { ip: "10.0.0.8", ua: "Safari" },
    ];
    const ip = {}, ua = {};
    mock.forEach((e) => {
      ip[e.ip] = (ip[e.ip] || 0) + 1;
      ua[e.ua] = (ua[e.ua] || 0) + 1;
    });
    setStats({ ip, ua });
  }, []);

  return (
    <div className="container mt-4">
      <h2>📊 Analytics & AI Defender</h2>
      <p className="text-muted small">
        Détection automatique de patterns suspects (IA).
      </p>

      <div className="row">
        <div className="col-md-6">
          <h5>Heatmap IP</h5>
          <table className="table table-sm">
            <thead><tr><th>IP</th><th>Hits</th></tr></thead>
            <tbody>
              {Object.entries(stats.ip).map(([ip, c]) => (
                <tr key={ip}>
                  <td>{ip}</td>
                  <td style={{ width: `${c * 20}px`, background: "#0d6efd33" }}>
                    {c}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-md-6">
          <h5>Utilisateur Agent</h5>
          <table className="table table-sm">
            <thead><tr><th>UA</th><th>Hits</th></tr></thead>
            <tbody>
              {Object.entries(stats.ua).map(([ua, c]) => (
                <tr key={ua}>
                  <td>{ua}</td>
                  <td style={{ width: `${c * 20}px`, background: "#19875433" }}>
                    {c}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
