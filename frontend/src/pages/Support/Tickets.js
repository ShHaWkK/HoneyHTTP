// 📁 frontend/src/pages/Support/Tickets.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Tickets() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");

  // Honeypot comportemental
  useEffect(() => {
    const session = Date.now();
    const log = (event, detail) => {
      fetch("http://localhost:8081/track", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({event, detail, session})
      });
    };
    window.addEventListener("click", e => log("click_support", {x:e.clientX,y:e.clientY}));
    window.addEventListener("keydown", e => log("key_support", {key:e.key}));
    return () => {
      window.removeEventListener("click", () => {});
      window.removeEventListener("keydown", () => {});
    };
  }, []);

  const handleFiles = e => setFiles(Array.from(e.target.files));

  const handleTicket = async e => {
    e.preventDefault();
    if (honeypot) {
      await fetch("http://localhost:8081/track", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({event:"honeypot_spam",field:honeypot})
      });
      return setStatus("🚨 Requête bloquée.");
    }

    setStatus("⏳ Envoi en cours…");
    const fd = new FormData();
    fd.append("name", name);
    fd.append("email", email);
    fd.append("subject", subject);
    fd.append("message", message);
    files.forEach((f,i)=>fd.append("files",f));

    const res = await fetch("http://localhost:8081/support/tickets", {
      method: "POST", body: fd
    });
    const json = await res.json();
    setStatus(json.ticket
      ? `✅ Ticket #${json.ticket} créé ! Un email vous a été envoyé.`
      : "❌ Erreur.");
    // reset
    setName(""); setEmail(""); setSubject(""); setMessage(""); setFiles([]);
  };

  return (
    <div className="container py-4" style={{ maxWidth: 600 }}>
      <h1>📩 Support client</h1>
      <form onSubmit={handleTicket} encType="multipart/form-data">
        <input type="text" style={{display:"none"}} value={honeypot}
               onChange={e=>setHoneypot(e.target.value)} />

        <input className="form-control mb-2" placeholder="Nom" value={name}
               onChange={e=>setName(e.target.value)} required/>
        <input className="form-control mb-2" type="email" placeholder="Email"
               value={email} onChange={e=>setEmail(e.target.value)} required/>
        <input className="form-control mb-2" placeholder="Objet"
               value={subject} onChange={e=>setSubject(e.target.value)} required/>
        <textarea className="form-control mb-2" rows={4} placeholder="Description"
                  value={message} onChange={e=>setMessage(e.target.value)} required/>

        <div className="mb-3">
          <label>Pièces jointes</label>
          <input type="file" multiple className="form-control" onChange={handleFiles}/>
        </div>

        <button className="btn btn-primary w-100">Envoyer le ticket</button>
      </form>
      {status && <div className="alert alert-info mt-3">{status}</div>}
    </div>
  );
}
