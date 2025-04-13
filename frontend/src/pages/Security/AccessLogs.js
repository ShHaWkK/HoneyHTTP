import React, { useEffect, useState } from "react";

export default function AccessLogs() {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    const res = await fetch("http://localhost:8080/access-logs");
    const data = await res.json();
    setLogs(data.logs || []);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="container mt-4">
      <h2>🛡️ Access Logs</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>IP</th>
            <th>User Agent</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={i}>
              <td>{log.ip}</td>
              <td>{log.ua}</td>
              <td>{new Date(log.time).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
