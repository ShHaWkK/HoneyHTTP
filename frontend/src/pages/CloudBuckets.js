import React, { useState } from "react";

export default function CloudBuckets() {
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
      <h2>☁️ Cloud Storage Manager</h2>
      <p className="text-muted">Visualisez et téléchargez les buckets distants</p>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Bucket Name</th>
            <th>Size</th>
            <th>Download</th>
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
                  ⬇️ Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {clicked && (
        <div className="alert alert-info mt-3">
          📦 Simulated download started: <strong>{clicked}</strong>
        </div>
      )}
    </div>
  );
}
