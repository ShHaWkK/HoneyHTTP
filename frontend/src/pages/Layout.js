import React, { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { startTracking } from "./tracker";


export default function Layout() {
  useEffect(() => {
    startTracking(); 
  }, []);

  return (
    <div className="d-flex">
      <div className="bg-dark text-white p-3" style={{ minHeight: "100vh", width: "250px" }}>
        <h3>Admin Honeypot</h3>
        <ul className="nav flex-column">
          <li><Link className="nav-link text-white" to="/users">👥 Users</Link></li>
          <li><Link className="nav-link text-white" to="/admin-create">🛡️ Create Admin</Link></li>
          <li><Link className="nav-link text-white" to="/spy">🕵️ Monitor</Link></li>
          <li><Link className="nav-link text-white" to="/chat">💬 Chat</Link></li>
        </ul>
      </div>
      <div className="p-4" style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
}
