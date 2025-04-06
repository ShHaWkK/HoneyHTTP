import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function TokenViewer() {
  const fakeJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    + "eyJ1c2VyIjoiYWRtaW4iLCJleHAiOjQ3OTk5OTk5OTl9."
    + "dummySIGNATURE54321abcdef";

  const [response, setResponse] = useState("");

  const sendToken = async () => {
    try {
      const res = await fetch("http://localhost:8080/track/token-used", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${fakeJWT}`
        },
        body: JSON.stringify({ action: "api_call", detail: "User tried using JWT" })
      });

      const data = await res.json();
      setResponse(data.message || "Token sent successfully.");
    } catch (err) {
      setResponse("❌ Failed to send token.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>🔐 JWT Token Preview</h2>
      <div className="bg-light p-3 rounded">
        <strong>Authorization:</strong> <br />
        <code className="text-break">{fakeJWT}</code>
      </div>

      <button className="btn btn-primary mt-3" onClick={sendToken}>
        🚀 Send to API
      </button>

      {response && (
        <div className="alert alert-info mt-3">
          {response}
        </div>
      )}
    </div>
  );
}
