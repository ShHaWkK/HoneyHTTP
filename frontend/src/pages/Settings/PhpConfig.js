import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PhpConfig() {
  const [code, setCode] = useState(`<?php
$username = $_POST['user'];
$password = $_POST['pass'];
if ($username == 'admin' && $password == 'supersecret') {
    echo "Welcome admin!";
    $token = generate_jwt($username);
}
?>`);
  const [status, setStatus] = useState("");
  const [token, setToken] = useState("");

  const handleSave = async () => {
    setStatus("💾 Sauvegarde en cours...");
    await new Promise(r => setTimeout(r, 800));
    setStatus("✅ Fichier enregistré avec succès !");
  };

  const handleToken = async () => {
    setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
             "eyJ1c2VyIjoiYWRtaW4iLCJleHAiOjQ3OTk5OTk5OTl9." +
             "fakeSIGNATURE12345");

    await fetch("http://localhost:8080/track/token-jwt");
  };

  return (
    <div className="container">
      <h2>📝 config.php Editor</h2>
      <textarea
        className="form-control bg-dark text-success"
        rows="12"
        value={code}
        onChange={e => setCode(e.target.value)}
        spellCheck={false}
      ></textarea>

      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-warning" onClick={handleSave}>💾 Enregistrer</button>
        <button className="btn btn-secondary" onClick={handleToken}>🎟️ Simuler JWT</button>
      </div>

      {status && <div className="alert alert-info mt-3">{status}</div>}
      {token && (
        <div className="alert alert-light mt-3">
          <strong>Token JWT :</strong><br />
          <code className="text-break">{token}</code>
        </div>
      )}
    </div>
  );
}
