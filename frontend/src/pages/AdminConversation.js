import React, { useEffect, useState } from "react";

export default function AdminConversation() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/admin/chat")
      .then(res => res.json())
      .then(data => setMessages(data.messages || []))
      .catch(() => setMessages([]));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Conversation Administrateurs</h2>
      <ul className="list-group">
        {messages.map((m, idx) => (
          <li key={idx} className="list-group-item">
            <strong>{m.author}:</strong> {m.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
