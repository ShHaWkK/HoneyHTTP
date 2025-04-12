import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    const page = location.pathname.replace("/", "") || "Dashboard";
    document.title = `SecurePanel • ${page}`;
  }, [location]);

  return (
    <div className="d-flex flex-column vh-100">
    {/* Header */}
    <header className="bg-primary text-white p-3 d-flex justify-content-between align-items-center flex-wrap">
      <h4 className="m-0">🛡️ SecurePanel</h4>
      <span className="small">Session active</span>
    </header>


      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="p-4 flex-grow-1 bg-light">
          <Outlet />
        </main>
      </div>

      <footer className="text-center text-muted p-2 bg-white border-top small">
        © 2025 SecurePanel Inc. — Cybersecurity Simulation
      </footer>
    </div>
  );
}
