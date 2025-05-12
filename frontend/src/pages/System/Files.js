import React, { useState } from "react";
import axios from "axios";
import "../../theme/terminal.css";

export default function Files() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);

  const handleCommand = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const cmd = input.trim();
    setOutput([...output, `root@panel:~# ${cmd}`]);
    setInput("");

    try {
      const res = await axios.get("http://localhost:8081/exec", {
        params: { cmd },
      });
      setOutput(prev => [...prev, res.data.result]);
    } catch (err) {
      setOutput(prev => [...prev, "[error] command failed"]);
    }
  };

  return (
    <div className="terminal-container container mt-3">
      <h4>🖥️ Simulated Root Terminal</h4>
      <div className="terminal-output bg-dark text-success p-3 rounded" style={{ minHeight: "250px", fontFamily: "monospace" }}>
        {output.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      <form onSubmit={handleCommand} className="mt-2 d-flex">
        <span className="me-2">root@panel:~#</span>
        <input
          className="form-control"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          autoFocus
        />
      </form>
      <div className="small text-muted mt-2">Pièges : tapez <code>cat /.env</code> ou <code>rm -rf /</code>...</div>
    </div>
  );
}
