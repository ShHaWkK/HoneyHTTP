import React from "react";
import { Link } from "react-router-dom";

export default function AdminPanel() {
  return (
    <div className="admin">
      <h1>Admin Panel</h1>
      <ul>
        <li><Link to="/xss">User Comments</Link></li>
        <li><Link to="/config-editor">Edit PHP File</Link></li>
        <li><Link to="/system/files">File Explorer</Link></li>
        <li><Link to="/exfiltration">Data Exfiltration</Link></li>
        <li><Link to="/system/logs">View Logs</Link></li>      
        </ul>
    </div>
  );
}  
