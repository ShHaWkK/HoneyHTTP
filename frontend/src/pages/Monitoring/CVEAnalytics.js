// 📁 frontend/src/pages/Monitoring/CVEAnalytics.js
import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";

export default function CVEAnalytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/monitoring/cves")
      .then(res => res.json())
      .then(json => {
        setData(json.cve_counts);
        const ctx = document.getElementById("cveChart");
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: json.cve_counts.map(c=>c.cve),
            datasets: [{
              label: "Occurrences",
              data: json.cve_counts.map(c=>c.count),
            }]
          },
          options: {
            scales: {
              y: { beginAtZero: true }
            },
            responsive: true,
          }
        });
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2>🔍 Corrélation CVE</h2>
      <canvas id="cveChart" height="80"></canvas>
      <div className="mt-4">
        <h5>Détails par CVE</h5>
        <ul className="list-group">
          {data.map((c,i) => (
            <li key={i} className="list-group-item d-flex justify-content-between">
              <span>{c.cve}</span>
              <span className="badge bg-primary rounded-pill">{c.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
