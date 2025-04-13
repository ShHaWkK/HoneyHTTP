// 📁 frontend/src/pages/Auth/Failure.js
import React from "react";

export default function AuthFailure() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center p-4 bg-white shadow rounded">
        <h4 className="text-danger">Échec d’authentification</h4>
        <p className="text-muted">Votre tentative de connexion a été refusée.</p>
        <p className="text-muted small">Vérifiez vos identifiants ou contactez l’administrateur.</p>
        <a href="/login" className="btn btn-outline-primary mt-3">🔁 Réessayer</a>
      </div>
    </div>
  );
}
