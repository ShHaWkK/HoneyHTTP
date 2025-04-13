import React, { useEffect, useState } from "react";

export default function Analytics() {
  const [metrics, setMetrics] = useState({});

  const fetchMetrics = async () => {
    const res = await fetch("http://localhost:8080/metrics");
    const data = await res.json();
    setMetrics(data);
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="container mt-4">
      <h2>📊 Analytics</h2>
      <ul className="list-group">
        <li className="list-group-item">🧠 AI Security Status: {metrics.ai || "Online"}</li>
        <li className="list-group-item">📡 Connected Devices: {metrics.devices || 42}</li>
        <li className="list-group-item">📈 CPU Usage: {metrics.cpu || "45%"}</li>
        <li className="list-group-item">💾 Storage Usage: {metrics.storage || "3.2 GB / 8 GB"}</li>
      </ul>
    </div>
  );
}
