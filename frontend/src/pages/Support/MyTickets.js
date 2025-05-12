// 📁 frontend/src/pages/Support/MyTickets.js
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/support/my-tickets")
      .then(res => res.json())
      .then(json => setTickets(json.tickets));
  }, []);

  const viewDetails = id => {
    if (Math.random() < 0.3) {
      window.location.href = "/error/502";
    } else {
      alert(`Détails du ticket ${id}\n(Status: voir backend logs)`);
    }
  };

  return (
    <div className="container py-4">
      <h1>🎫 Mes tickets</h1>
      <table className="table">
        <thead>
          <tr><th>ID</th><th>Objet</th><th>Statut</th><th></th></tr>
        </thead>
        <tbody>
          {tickets.map(t => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.subject}</td>
              <td>{t.status}</td>
              <td>
                <button className="btn btn-sm btn-outline-primary"
                        onClick={()=>viewDetails(t.id)}>
                  Voir détails
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3">
        <button className="btn btn-outline-success"
                onClick={()=>{
                  fetch(`http://localhost:8081/support/tickets/${tickets[0]?.id}/subscribe`,{method:"POST"})
                    .then(()=>alert("Subscribed to updates!"));
                }}>
          🔔 S’abonner aux mises à jour
        </button>
      </div>
    </div>
  );
}
