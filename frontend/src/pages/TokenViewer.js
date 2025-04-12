import React, { useState } from "react";

export default function TokenViewer() {
  const fakeJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
                + "eyJ1c2VyIjoiYWRtaW4iLCJleHAiOjQ3OTk5OTk5OTl9."
                + "fakeSIGNATURE12345";
  const [response, setResponse] = useState("");

  const sendToAPI = async () => {
    try {
      const res = await fetch("http://localhost:8080/track/token-used", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${fakeJWT}`
        },
        body: JSON.stringify({ action: "api_call", detail: "JWT sent manually" })
      });
      const data = await res.json();
      setResponse(data.message || "Token used");
    } catch (err) {
      setResponse("❌ Échec lors de l'envoi du token");
    }
  };

  return (
    <div className="container mt-4">
      <h2>🔑 Token JWT Preview</h2>
      <div className="bg-light p-3 rounded">
        <strong>Authorization:</strong><br />
        <code className="text-break">{fakeJWT}</code>
      </div>
      <button className="btn btn-outline-primary mt-3" onClick={sendToAPI}>
        🚀 Envoyer à l’API
      </button>
      {response && <div className="alert alert-info mt-3">{response}</div>}
    </div>
  );
}
