import React, { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    document.title = "Admin Dashboard • Secure Panel";
  }, []);

  return (
    <div className="container mt-4">
      <h1>Welcome to Admin Dashboard</h1>
      <p>This section contains sensitive configurations.</p>

      <div className="alert alert-warning">
        <strong>Warning:</strong> Your session token is active.
      </div>

      <pre>
        {localStorage.getItem("jwt")
          ? `JWT Token:\n${localStorage.getItem("jwt")}`
          : "No token found."}
      </pre>

      <div className="mt-4">
        <h5>Actions disponibles :</h5>
        <ul>
          <li>🔧 Modifier les configurations</li>
          <li>📄 Voir les fichiers du système</li>
          <li>🧪 Accéder aux journaux d'activité</li>
        </ul>
      </div>
    </div>
  );
}
