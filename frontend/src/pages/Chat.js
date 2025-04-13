// path: frontend/src/pages/Chat.js
import React, { useState, useEffect } from "react";

export default function Chat() {
  const [username, setUsername] = useState("guest");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const send = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:8080/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, message }),
    });
    setMessage("");
    fetchMessages();
  };

  const fetchMessages = async () => {
    const res = await fetch("http://localhost:8080/chat");
    const data = await res.json();
    setMessages(data.messages);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Public Chat Room</h2>
      <form onSubmit={send}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="form-control" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message" className="form-control mt-2" />
        <button type="submit" className="btn btn-primary mt-2">Send</button>
      </form>
      <div className="mt-4">
        {messages.map((msg, idx) => (
          <div key={idx} dangerouslySetInnerHTML={{ __html: msg }} className="alert alert-light" />
        ))}
      </div>
    </div>
  );
}
