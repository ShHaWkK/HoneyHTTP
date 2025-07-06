// 📁 frontend/src/pages/Pricing.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Pricing() {
  const plans = [
    { name: "Free", price: "0€",  features: ["50 logs/jour", "Support communautaire"] },
    { name: "Pro",  price: "49€/mois",  features: ["5 000 logs/jour", "Support 24/7", "MFA avancée"] },
    { name: "Enterprise", price: "Sur devis", features: ["Logs illimités", "SLA 99.9%", "Intégrations API"] },
  ];

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [honeypot, setHoneypot] = useState("");          // champ invisible pour bots
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Faux warning de sécurité dans la console pour attirer l'attention
    console.warn("⚠️ TLS 1.0 détecté sur /pricing (CVE-2021-3451)");
    console.error("🔥 Algorithme de chiffrement RC4 obsolète (CVE-2013-2566)");
  }, []);

  const handleSubscribe = async e => {
    e.preventDefault();
    setError("");
    setStatus("");

    // Si un bot remplit le honeypot, on le trace
    if (honeypot) {
      await fetch("http://localhost:8081/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "honeypot_bot", field: honeypot }),
      });
      return setError("🚨 Votre tentative a été détectée et bloquée.");
    }

    // Validation sommaire du formulaire
    if (!cardNumber.match(/^\d{12,19}$/) || !expiry || !cvv.match(/^\d{3,4}$/)) {
      return setError("⚠️ Informations de carte invalides.");
    }

    // 20% de chance d’erreur 502 pour simuler le réseau
    if (Math.random() < 0.2) {
      setError("🚨 Erreur 502 — Service de paiement temporairement indisponible.");
      return;
    }

    setStatus("⏳ Traitement de votre paiement…");
    await new Promise(r => setTimeout(r, 1500));

    // On loge discrètement le numéro de carte dans le honeypot
    await fetch("http://localhost:8081/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "billing_info",
        plan: selectedPlan.name,
        card: cardNumber,
        expiry,
        cvv
      }),
    });

    setStatus(`✅ Vous êtes abonné au plan ${selectedPlan.name} !`);
    // remise à zéro
    setCardNumber(""); setExpiry(""); setCvv("");
  };

  return (
    <div className="container py-4">
      <h1>💳 Tarification</h1>
      <div className="row gy-4">
        {plans.map(p => (
          <div key={p.name} className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <h4>{p.name}</h4>
                <h2>{p.price}</h2>
                <ul className="list-unstyled mt-3">
                  {p.features.map(f => <li key={f}>• {f}</li>)}
                </ul>
                <button
                  className={`btn ${selectedPlan===p ? "btn-success":"btn-outline-primary"} mt-3`}
                  onClick={() => {
                    setSelectedPlan(p);
                    setStatus("");
                    setError("");
                  }}
                >
                  {selectedPlan===p ? "Sélectionné" : "Choisir"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <form className="mt-5" onSubmit={handleSubscribe}>
          {/* honeypot caché */}
          <input
            type="text"
            style={{ display: "none" }}
            value={honeypot}
            onChange={e => setHoneypot(e.target.value)}
            placeholder="Ne pas renseigner"
          />

          <h3>🔒 Détails de paiement pour {selectedPlan.name}</h3>
          <div className="mb-2">
            <input
              className="form-control"
              placeholder="Numéro de carte"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              required
            />
          </div>
          <div className="row">
            <div className="col">
              <input
                className="form-control"
                placeholder="MM/AA"
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
                required
              />
            </div>
            <div className="col">
              <input
                className="form-control"
                placeholder="CVV"
                type="password"
                value={cvv}
                onChange={e => setCvv(e.target.value)}
                required
              />
            </div>
          </div>
          <button className="btn btn-success mt-3" type="submit">
            Confirmer ({selectedPlan.price})
          </button>
        </form>
      )}

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {!error && status && <div className="alert alert-info mt-3">{status}</div>}
    </div>
  );
}
