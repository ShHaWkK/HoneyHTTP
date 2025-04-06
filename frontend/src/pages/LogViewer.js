// 📁 frontend/src/pages/LogViewer.js
import React, { useEffect, useState } from "react";

export default function LogViewer() {
  const [logs, setLogs] = useState("");

  const fetchLogs = async () => {
    const res = await fetch("http://localhost:8080/logs");
    const data = await res.text();
    setLogs(data);
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Honeypot Activity Logs</h2>
      <pre>{logs}</pre>
    </div>
  );
}
