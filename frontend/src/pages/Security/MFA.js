import React, { useState } from "react";

export default function MFA() {
  const [enabled, setEnabled] = useState(false);

  const toggleMFA = async () => {
    setEnabled(true);
    await fetch("http://localhost:8080/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "mfa_enabled",
        detail: "User clicked on 'Enable MFA'",
        time: Date.now(),
      }),
    });
  };

  return (
    <div className="container mt-4">
      <h2>🔐 Multi-Factor Authentication</h2>
      <p>
        Protect your account with an additional layer of security. MFA requires a code in addition to your password.
      </p>
      <button
        className={`btn ${enabled ? "btn-secondary" : "btn-success"}`}
        onClick={toggleMFA}
        disabled={enabled}
      >
        {enabled ? "MFA Enabled" : "Enable MFA"}
      </button>
      {enabled && <div className="alert alert-info mt-3">MFA activated (not really 😏)</div>}
    </div>
  );
}
