import React, { useState } from "react";

export default function MFA() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");

  const handleVerify = async () => {
    setStatus("⏳ Vérification du code...");
    await new Promise(r => setTimeout(r, 1000));
    setStatus("❌ Code invalide. Essayez encore."); // toujours invalide, mais crédible

    // tracking de curiosité
    await fetch("http://localhost:8080/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "mfa_attempt", code, page: "MFA" }),
    });
  };

  return (
    <div className="container mt-5 text-center">
      <h2>🔐 Vérification Multi-Facteurs</h2>
      <p className="text-muted">Entrez le code généré par votre app d’authentification</p>
      <input
        type="text"
        className="form-control w-25 mx-auto"
        placeholder="000000"
        maxLength={6}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button className="btn btn-primary mt-3" onClick={handleVerify}>
        Vérifier le code
      </button>
      {status && <div className="alert alert-warning mt-3">{status}</div>}
    </div>
  );
}
