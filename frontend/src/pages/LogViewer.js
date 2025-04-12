import React, { useEffect, useState } from "react";

export default function LogViewer() {
  const [logs, setLogs] = useState("");

  const fetchLogs = async () => {
    const res = await fetch("http://localhost:8080/logs");
    const text = await res.text();
    setLogs(text);
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h2 className="mb-3">🧾 System Logs</h2>
      <div className="bg-dark text-light p-3 rounded" style={{ minHeight: "300px", fontFamily: "monospace" }}>
        <pre className="m-0">{logs || "Loading..."}</pre>
      </div>
      <div className="small text-muted mt-2">Logs refresh every 3s</div>
    </div>
  );
}
