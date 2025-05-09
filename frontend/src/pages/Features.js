// pahth: frontend/src/pages/Features.js
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Features() {
  const [sqlFilter, setSqlFilter] = useState("");
  const [sqlResult, setSqlResult] = useState(null);
  const [xssInput, setXssInput] = useState("");
  const [xssComments, setXssComments] = useState([]);
  const [rceCmd, setRceCmd] = useState("");
  const [rceOutput, setRceOutput] = useState("");

  // 1) Démo SQL Injection
  const handleSqlSearch = async () => {
    try {
      const res = await fetch(`http://localhost:8080/users?filter=${encodeURIComponent(sqlFilter)}`);
      const data = await res.json();
      setSqlResult(JSON.stringify(data, null, 2));
      // tracking
      await fetch("http://localhost:8080/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "feature_sql_search", filter: sqlFilter }),
      });
    } catch {
      setSqlResult("Erreur de connexion");
    }
  };

  // 2) Démo XSS
  const handleXss = async e => {
    e.preventDefault();
    await fetch("http://localhost:8080/comment", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ message: xssInput }),
    });
    setXssInput("");
    const res = await fetch("http://localhost:8080/comments");
    const { comments } = await res.json();
    setXssComments(comments);
  };

  // 3) Démo RCE / CVE
  const handleRce = async () => {
    const res = await fetch(`http://localhost:8080/exec?cmd=${encodeURIComponent(rceCmd)}`);
    const data = await res.json();
    setRceOutput(data.result || data.error);
  };

  return (
    <div className="container py-4">
      <h1>🛠️ Démonstrateur de fonctionnalités avancées</h1>

      {/* SQL Injection demo */}
      <section className="mt-5">
        <h3>🔍 Recherche utilisateur (SQL)</h3>
        <div className="input-group mb-2">
          <input
            className="form-control"
            placeholder="Ex: admin' OR '1'='1"
            value={sqlFilter}
            onChange={e => setSqlFilter(e.target.value)}
          />
          <button className="btn btn-outline-primary" onClick={handleSqlSearch}>
            Rechercher
          </button>
        </div>
        {sqlResult && (
          <pre className="bg-light p-3" style={{ whiteSpace: "pre-wrap" }}>
            {sqlResult}
          </pre>
        )}
      </section>

      {/* XSS demo */}
      <section className="mt-5">
        <h3>💬 Mur de commentaires (XSS)</h3>
        <form onSubmit={handleXss}>
          <div className="mb-2">
            <textarea
              className="form-control"
              rows={2}
              placeholder="<script>alert('XSS')</script>"
              value={xssInput}
              onChange={e => setXssInput(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-outline-warning">Poster</button>
        </form>
        <div className="mt-3">
          {xssComments.map((c, i) => (
            <div key={i} dangerouslySetInnerHTML={{ __html: c }} className="border-bottom py-1" />
          ))}
        </div>
      </section>

      {/* RCE demo */}
      <section className="mt-5">
        <h3>💻 Simulateur de commandes (RCE)</h3>
        <div className="input-group mb-2">
          <input
            className="form-control"
            placeholder="Ex: ls /"
            value={rceCmd}
            onChange={e => setRceCmd(e.target.value)}
          />
          <button className="btn btn-outline-danger" onClick={handleRce}>
            Exécuter
          </button>
        </div>
        {rceOutput && (
          <pre className="bg-dark text-light p-3" style={{ fontFamily: "monospace" }}>
            {rceOutput}
          </pre>
        )}
      </section>
    </div>
  );
}
