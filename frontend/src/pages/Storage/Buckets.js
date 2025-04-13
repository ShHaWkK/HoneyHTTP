import React, { useState } from "react";

export default function Cloud() {
  const [msg, setMsg] = useState("");

  const download = async () => {
    await fetch("http://localhost:8080/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "cloud_download", detail: "dump.sql", session: Date.now() }),
    });
    setMsg("📦 Téléchargement simulé de dump.sql");
  };

  return (
    <div className="container">
      <h2 className="mb-3">☁️ Cloud Buckets</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">bucket-backup-2025</h5>
          <p className="text-muted">Contient les sauvegardes SQL et JWT</p>
          <button className="btn btn-outline-primary" onClick={download}>
            ⬇️ Télécharger dump.sql
          </button>
          {msg && <div className="alert alert-info mt-3">{msg}</div>}
        </div>
      </div>
    </div>
  );
}
