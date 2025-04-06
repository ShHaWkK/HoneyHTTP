import React from "react";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard. View and upload files below.</p>
      <button onClick={() => window.location.href = "/upload"}>Upload a file</button>
    </div>
  );
}
