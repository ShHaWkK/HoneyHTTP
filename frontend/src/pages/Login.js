// 📁 frontend/src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../theme/homepage.css";

export default function Login() {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/track/creds", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, password }),
    });

    const data = await res.json();
    if (data.user === "admin") {
      localStorage.setItem("jwt", "eyFAKE.admin.token");
    }

    navigate("/dashboard"); // toujours redirigé même si creds fausses
  };

  return (
    <div className="homepage login-box">
      <h2>🔐 SecurePanel™ Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" value={username} onChange={e => setUser(e.target.value)} placeholder="Nom d'utilisateur" required />
        <input type="password" value={password} onChange={e => setPass(e.target.value)} placeholder="Mot de passe" required />
        <button type="submit" className="btn btn-primary">Connexion</button>
        <div className="mt-3 text-muted small">
          <a href="/auth/failure">Mot de passe oublié ?</a> — <a href="/auth/mfa">Activer MFA</a>
        </div>
      </form>
    </div>
  );
}
