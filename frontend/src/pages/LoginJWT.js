import React, { useState } from "react";

export default function LoginJWT() {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const [token, setToken] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/login-jwt", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, password }),
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("jwt", data.token); // 😈 token facilement volable
      setToken(data.token);
    }
  };

  return (
    <div className="container">
      <h2>Login to Secure Portal</h2>
      <form onSubmit={handleLogin}>
        <input value={username} onChange={e => setUser(e.target.value)} placeholder="Username" />
        <input type="password" value={password} onChange={e => setPass(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      {token && (
        <div className="alert alert-warning mt-3">
          Your token: <code>{token}</code>
        </div>
      )}
    </div>
  );
}
