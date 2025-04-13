import React, { useEffect, useState } from "react";

export default function Logs() {
  const [logs, setLogs] = useState("Loading...");

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
    <div className="container mt-4">
      <h2>📄 System Logs</h2>
      <div className="bg-dark text-light p-3 rounded" style={{ minHeight: "300px", fontFamily: "monospace" }}>
        <pre className="m-0">{logs}</pre>
      </div>
    </div>
  );
}
