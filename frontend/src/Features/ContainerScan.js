// frontend/src/pages/Features/ContainerScan.jsx
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ContainerScan() {
  const [image, setImage] = useState("");
  const [cves, setCves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScan = async () => {
    if (!image) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/scan?image=${encodeURIComponent(image)}`);
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const { image: img, cves: data } = await res.json();
      setCves(data);

      // 2) Enregistrer l’événement de scan
      await fetch("http://localhost:8081/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "container_scan",
          image: img,
          cve_count: data.length,
        }),
      });
    } catch (e) {
      console.error(e);
      setError("Impossible de contacter le service de scan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h1>🐳 Scanner de vulnérabilités de conteneur</h1>

      <div className="input-group mb-3 mt-4">
        <input
          type="text"
          className="form-control"
          placeholder="Ex: nginx:latest"
          value={image}
          onChange={e => setImage(e.target.value)}
        />
        <button
          className="btn btn-outline-primary"
          onClick={handleScan}
          disabled={loading || !image}
        >
          {loading ? "Scanning…" : "Scan"}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {cves.length > 0 && (
        <div className="mt-4">
          <h4>Résultats pour <code>{image}</code> :</h4>
          <table className="table table-striped mt-2">
            <thead>
              <tr>
                <th>CVE</th>
                <th>Sévérité</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {cves.map((c, i) => (
                <tr key={i}>
                  <td>{c.id}</td>
                  <td>{c.severity}</td>
                  <td>{c.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
