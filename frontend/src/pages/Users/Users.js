import React, { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const res = await fetch("http://localhost:8080/users");
    const data = await res.json();
    setUsers(data || []);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="container mt-4">
      <h2>👥 Users</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
