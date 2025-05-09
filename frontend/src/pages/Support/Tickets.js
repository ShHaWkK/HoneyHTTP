// path : frontend/src/pages/Support/Tickets.js
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Support() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState("");

  const handleTicket = async e => {
    e.preventDefault();
    // log sur champ honeypot si rempli
    if (honeypot) {
      await fetch("http://localhost:8080/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "honeypot_spam", field: honeypot }),
      });
    }
    // simulate slow processing
    setStatus("⏳ Envoi du ticket…");
    await new Promise(r => setTimeout(r, 1500));
    // log event support
    await fetch("http://localhost:8080/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "support_ticket", name, email, subject }),
    });
    setStatus(`✅ Ticket #${Math.floor(Math.random()*9000)+1000} créé !`);
    // reset
    setName(""); setEmail(""); setSubject(""); setMessage("");
  };

  return (
    <div className="container py-4">
      <h1>📩 Support client</h1>
      <form onSubmit={handleTicket} className="mt-4">
        {/* honeypot field invisible */}
        <input
          type="text"
          style={{ display: "none" }}
          value={honeypot}
          onChange={e => setHoneypot(e.target.value)}
          placeholder="Ne remplir que si vous êtes un bot"
        />

        <div className="mb-2">
          <input
            className="form-control"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Votre nom"
            required
          />
        </div>
        <div className="mb-2">
          <input
            className="form-control"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Votre email"
            required
          />
        </div>
        <div className="mb-2">
          <input
            className="form-control"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Objet"
            required
          />
        </div>
        <div className="mb-2">
          <textarea
            className="form-control"
            rows={4}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Description du problème"
            required
          />
        </div>
        <button className="btn btn-primary">Envoyer le ticket</button>
      </form>
      {status && <div className="alert alert-success mt-3">{status}</div>}
    </div>
  );
}
