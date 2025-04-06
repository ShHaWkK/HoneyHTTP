import React, { useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  const loadUsers = async () => {
    const res = await axios.get("http://localhost:8080/users", {
      headers: { "X-Custom": "token-leak" },
      params: { filter },
    });
    setUsers(res.data);
  };

  return (
    <div>
      <h2>List Users</h2>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter…" className="form-control" />
      <button onClick={loadUsers} className="btn btn-primary mt-2">Search</button>

      <table className="table mt-4">
        <thead><tr><th>ID</th><th>Username</th><th>Email</th></tr></thead>
        <tbody>
          {users.length > 0 ? users.map(u => (
            <tr key={u.id}><td>{u.id}</td><td>{u.username}</td><td>{u.email}</td></tr>
          )) : <tr><td colSpan={3}>No users loaded.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
