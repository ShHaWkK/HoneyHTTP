import React, { useEffect, useState } from "react";

export default function Logs() {
  const [logs, setLogs] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    // Simuler erreur 5% du temps
    if (Math.random() < 0.05) {
      setError("502 Bad Gateway — serveur indisponible temporairement");
      setLogs("");
    } else {
      try {
        const res = await fetch("http://localhost:8081/logs");
        const text = await res.text();
        setLogs(text);
      } catch {
        setError("Logs : Erreur de connexion");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
    const iv = setInterval(fetchLogs, 5000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="container mt-4">
      <h2>📄 System Logs</h2>
      {loading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="bg-dark text-light p-3 rounded" style={{ minHeight: "300px", fontFamily: "monospace" }}>
          <pre className="m-0">{logs}</pre>
        </div>
      )}
    </div>
  );
}
