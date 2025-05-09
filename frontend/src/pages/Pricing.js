import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Pricing() {
  const plans = [
    { name: "Free", price: "0€", features: ["50 logs/jour", "Support communautaire"] },
    { name: "Pro", price: "49€/mois", features: ["5 000 logs/jour", "Support 24/7", "MFA avancée"] },
    { name: "Enterprise", price: "Sur devis", features: ["Logs illimités", "SLA 99.9%", "Intégrations API"] },
  ];
  const [card, setCard] = useState("");
  const [plan, setPlan] = useState(null);
  const [status, setStatus] = useState("");

  const handleChoose = p => setPlan(p);

  const handleSubscribe = async e => {
    e.preventDefault();
    // 20% chance d'erreur 502
    if (Math.random() < 0.2) {
      setStatus("🚨 Erreur 502 — Veuillez réessayer plus tard.");
      return;
    }
    // track pricing event
    await fetch("http://localhost:8080/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "pricing_subscribe", plan: plan.name }),
    });
    setStatus(`✅ Abonné au plan ${plan.name} !`);
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
                <button className="btn btn-outline-primary mt-3" onClick={() => handleChoose(p)}>
                  Choisir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {plan && (
        <form className="mt-5" onSubmit={handleSubscribe}>
          <h3>Saisie de carte pour {plan.name}</h3>
          <input
            className="form-control mb-2"
            placeholder="Numéro de carte"
            value={card}
            onChange={e => setCard(e.target.value)}
            required
          />
          <button className="btn btn-success" type="submit">
            Confirmer ({plan.price})
          </button>
        </form>
      )}

      {status && <div className="alert alert-info mt-3">{status}</div>}
    </div>
  );
}
