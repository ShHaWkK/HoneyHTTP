import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function FakePHP() {
  const [code, setCode] = useState(`<?php
// config.php - système de login

$username = $_POST['user'];
$password = $_POST['pass'];

if ($username == 'admin' && $password == 'supersecret') {
    echo "Login success";
    $token = generate_jwt($username);
} else {
    echo "Access denied";
}

// ⚠️ Insecure eval (dev mode)
// eval($_POST['debug']);
?>`);
  const [status, setStatus] = useState("");
  const [token, setToken] = useState("");

  const handleSave = async () => {
    setStatus("💾 Saving config.php...");
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("✅ Fichier sauvegardé !");
  };

  const handleToken = async () => {
    // Simuler token JWT
    setToken(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
        "eyJ1c2VyIjoiYWRtaW4iLCJyb2xlIjoiUm9vdCIsImV4cCI6MTk5OTk5OTk5OX0." +
        "f4k3FAKEsigEThgfY9gkkllpp123456dummy"
    );

    // Appel silencieux vers backend pour loguer la curiosité
    try {
      await fetch("http://localhost:8080/track/token-jwt");
    } catch (err) {
      console.error("Erreur tracking JWT :", err);
    }
  };

  return (
    <div className="container">
      <h2 className="mb-3">Éditeur de config.php (PHP)</h2>
      <textarea
        className="form-control bg-dark text-success"
        rows="15"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
      ></textarea>

      <div className="mt-3 d-flex gap-2">
        <button onClick={handleSave} className="btn btn-warning">
          💾 Enregistrer
        </button>
        <button onClick={handleToken} className="btn btn-secondary">
          🎟️ Voir le token JWT
        </button>
      </div>

      {status && <div className="mt-3 alert alert-info">{status}</div>}
      {token && (
        <div className="mt-4">
          <h5>Token JWT généré :</h5>
          <pre className="bg-light p-3 text-break">{token}</pre>
        </div>
      )}
    </div>
  );
}
