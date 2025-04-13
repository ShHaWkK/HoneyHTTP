import React, { useState } from "react";

export default function Buckets() {
  const [clicked, setClicked] = useState("");

  const logDownload = async (bucket) => {
    setClicked(bucket);
    await fetch("http://localhost:8080/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "cloud_bucket_download", bucket }),
    });
  };

  const buckets = [
    { name: "securepanel-assets", size: "23 MB" },
    { name: "client-data-dump", size: "1.2 GB" },
    { name: "old-backups-2022", size: "800 MB" },
  ];

  return (
    <div className="container mt-4">
      <h2>☁️ Buckets de Stockage</h2>
      <p className="text-muted">Gérez vos fichiers distants en toute sécurité</p>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Taille</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {buckets.map((b) => (
            <tr key={b.name}>
              <td>{b.name}</td>
              <td>{b.size}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => logDownload(b.name)}
                >
                  ⬇️ Télécharger
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {clicked && (
        <div className="alert alert-info mt-3">
          📦 Téléchargement simulé : <strong>{clicked}</strong>
        </div>
      )}
    </div>
  );
}
