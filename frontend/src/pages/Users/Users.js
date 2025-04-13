import React, { useState, useEffect } from "react";

export default function Users() {
  const [filter, setFilter] = useState("");
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await fetch(`http://localhost:8080/users?filter=${filter}`);
    const data = await res.json();
    if (Array.isArray(data)) setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container">
      <h2>👥 Utilisateurs</h2>
      <input
        className="form-control"
        placeholder="Rechercher un utilisateur"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
      />
      <table className="table table-bordered mt-3">
        <thead>
          <tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Last Login</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.lastLogin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
