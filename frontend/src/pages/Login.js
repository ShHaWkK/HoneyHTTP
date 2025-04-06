import React, { useState } from "react";

export default function Login() {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, password }),
    });
    const data = await res.json();
    alert(data.message);
    if (data.user) window.location.href = "/dashboard";
  };

  return (
    <div className="login-container">
      <h2>Secure Panel Login</h2>
      <form onSubmit={handleLogin}>
        <input value={username} onChange={e => setUser(e.target.value)} placeholder="Username" />
        <input type="password" value={password} onChange={e => setPass(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
