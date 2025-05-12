// frontend/src/pages/Login.js
import React, { useState, useEffect } from "react";

export default function Login() {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  // Honeypot field
  const [hp, setHp] = useState("");
  
  useEffect(() => {
    console.warn("⚠️ Warning: Deprecated TLSv1.0 detected on /login (CVE-2021-3451)");
    console.error("🔥 Error: Weak password hashing algorithm bcrypt<10 in use! (CVE-2022-1234)");
  }, []);
  
  const handleLogin = async e => {
    e.preventDefault();
    // spam honeypot
    if (hp) {
      fetch("http://localhost:8081/track", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({event:"honeypot_spam", field: hp}),
      });
    }
    const res = await fetch("http://localhost:8081/login", {
      method: "POST",
      headers: {"Content-Type":"application/x-www-form-urlencoded"},
      body: new URLSearchParams({username, password})
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("jwt", data.token);
      console.log("✅ JWT stored in localStorage");
    }
    // toujours rediriger vers dashboard, même si creds fausses
    window.location.href = "/dashboard";
  };

  return (
    <div className="container mt-5" style={{maxWidth:400}}>
      <h2 className="mb-4">🔐 SecurePanel™ Login</h2>
      <form onSubmit={handleLogin}>
        {/* honeypot invisible */}
        <input
          type="text"
          style={{display:"none"}}
          value={hp}
          onChange={e=>setHp(e.target.value)}
          placeholder="Ne pas remplir"
        />
        <div className="mb-3">
          <input
            className="form-control"
            value={username}
            onChange={e=>setUser(e.target.value)}
            placeholder="Nom d'utilisateur"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e=>setPass(e.target.value)}
            placeholder="Mot de passe"
            required
          />
        </div>
        <button className="btn btn-primary w-100">Connexion</button>
      </form>
    </div>
  );
}
