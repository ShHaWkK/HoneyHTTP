import React, { useState } from "react";

export default function CreateAdmin() {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const [result, setResult] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/admin/create", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, password }),
    });
    const data = await res.json();
    setResult(JSON.stringify(data));
  };

  return (
    <div>
      <h2>Create New Admin</h2>
      <form onSubmit={submit}>
        <input className="form-control" value={username} onChange={e => setUser(e.target.value)} placeholder="Username" />
        <input className="form-control mt-2" value={password} onChange={e => setPass(e.target.value)} placeholder="Password" />
        <button className="btn btn-success mt-3" type="submit">Create</button>
      </form>
      {result && <div className="alert alert-warning mt-4">{result}</div>}
    </div>
  );
}
