import React, { useState } from "react";

export default function AccessToken() {
  const fakeJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  const [sent, setSent] = useState(false);

  const sendToken = async () => {
    await fetch("http://localhost:8081/track/token-used", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${fakeJWT}`,
      },
      body: JSON.stringify({
        action: "token_sent_manually",
        detail: "Curious attacker sent fake JWT",
      }),
    });
    setSent(true);
  };

  return (
    <div className="container mt-4">
      <h2>🔑 Access Token</h2>
      <p>Here is your access token:</p>
      <pre className="bg-light p-3 rounded">{fakeJWT}</pre>
      <button className="btn btn-outline-primary mt-2" onClick={sendToken}>
        🚀 Send to API
      </button>
      {sent && <div className="alert alert-success mt-3">Token sent! Thanks 😈</div>}
    </div>
  );
}
