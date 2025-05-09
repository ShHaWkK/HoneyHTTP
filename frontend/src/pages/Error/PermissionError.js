import React from "react";

export default function PermissionError() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <h1 className="display-1 text-danger">502</h1>
      <h3 className="mb-3">Erreur de passerelle</h3>
      <p className="text-muted">
        La requête a échoué côté serveur. Merci de réessayer dans quelques instants.
      </p>
    </div>
  );
}
