// frontend/src/pages/Chat.js
import React, { useState, useEffect } from "react";

export default function Chat() {
  const [username, setUsername] = useState("guest");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    // Messages statiques pour simulation
    "<b>admin</b>: Serveur de production redémarré avec succès",
    "<b>devops1</b>: Migration base de données terminée",
    "<b>support</b>: 3 nouveaux tickets en attente",
    "<b>sysadmin</b>: Monitoring CPU à 85%, surveillance requise",
    "<b>backup</b>: Sauvegarde nocturne OK - 1.2TB archivés"
  ]);

  const [isConnected, setIsConnected] = useState(false);

  // Messages prédéfinis pour la simulation
  const simulatedMessages = [
    "<b>monitoring</b>: Alerte: Trafic inhabituel détecté sur le port 443",
    "<b>firewall</b>: Règle temporaire ajoutée pour IP 192.168.1.100",
    "<b>gitlab-ci</b>: Pipeline #127 terminé - tests passés",
    "<b>operator</b>: Maintenance programmée ce soir 23h-01h",
    "<b>vpnuser</b>: Connexion VPN établie depuis Berlin",
    "<b>admin</b>: Logs d'audit générés pour la semaine",
    "<b>support</b>: Ticket #1025 résolu - problème d'authentification"
  ];

  const send = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Ajouter le message de l'utilisateur
    const newUserMessage = `<b>${username}</b>: ${message}`;
    setMessages(prev => [...prev, newUserMessage]);

    // Simuler l'envoi au backend (honeypot logging)
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8081";
      await fetch(`${API_URL}/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username, message }),
      });
    } catch (error) {
      console.log("Backend logging failed (expected in honeypot)", error);
    }

    setMessage("");

    // Simuler une réponse automatique après 2-5 secondes
    setTimeout(() => {
      const randomResponse = simulatedMessages[Math.floor(Math.random() * simulatedMessages.length)];
      setMessages(prev => [...prev, randomResponse]);
    }, Math.random() * 3000 + 2000);
  };

  // Simuler des messages automatiques toutes les 10-30 secondes
  useEffect(() => {
    setIsConnected(true);
    
    const interval = setInterval(() => {
      const randomMessage = simulatedMessages[Math.floor(Math.random() * simulatedMessages.length)];
      setMessages(prev => {
        // Éviter les doublons consécutifs
        if (prev[prev.length - 1] !== randomMessage) {
          return [...prev, randomMessage].slice(-15); // Garder seulement les 15 derniers messages
        }
        return prev;
      });
    }, Math.random() * 20000 + 10000); // 10-30 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">💬 Chat Équipe SecurePanel</h5>
              <span className="badge bg-success">
                {isConnected ? "🟢 Connecté" : "🔴 Déconnecté"}
              </span>
            </div>
            
            <div className="card-body" style={{ height: "400px", overflowY: "auto" }}>
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className="alert alert-light border-left border-primary mb-2 py-2" 
                  dangerouslySetInnerHTML={{ __html: msg }} 
                />
              ))}
            </div>
            
            <div className="card-footer">
              <form onSubmit={send}>
                <div className="row g-2">
                  <div className="col-md-3">
                    <input 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      placeholder="Nom d'utilisateur" 
                      className="form-control form-control-sm"
                      maxLength="20"
                    />
                  </div>
                  <div className="col-md-7">
                    <input
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)} 
                      placeholder="Tapez votre message..." 
                      className="form-control form-control-sm"
                      maxLength="200"
                    />
                  </div>
                  <div className="col-md-2">
                    <button type="submit" className="btn btn-primary btn-sm w-100">
                      Envoyer
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-secondary text-white">
              <h6 className="mb-0">👥 Utilisateurs en ligne</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                {["admin", "devops1", "support", "sysadmin", "monitoring", "backup"].map(user => (
                  <li key={user} className="mb-2">
                    <span className="badge bg-success me-2">●</span>
                    {user}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="card mt-3">
            <div className="card-header bg-warning text-dark">
              <h6 className="mb-0">⚠️ Alertes Système</h6>
            </div>
            <div className="card-body">
              <div className="small">
                <div className="mb-2">🔴 CPU: 85% - Surveillance</div>
                <div className="mb-2">🟡 RAM: 12GB/16GB utilisés</div>
                <div className="mb-2">🟢 Disque: 45% utilisé</div>
                <div className="mb-2">🔵 Réseau: 2.3GB/s</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
