import React, { useState } from "react";
import axios from "axios";
import "./../theme/terminal.css"; // style terminal à créer

export default function FileExplorer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);

  const handleCommand = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const cmd = input.trim();
    setOutput([...output, `root@honeypot:~# ${cmd}`]);
    setInput("");

    try {
      const res = await axios.get(`http://localhost:8080/exec`, {
        params: { cmd },
      });
      setOutput((prev) => [...prev, res.data.result]);
    } catch (err) {
      setOutput((prev) => [...prev, "[error] command failed"]);
    }
  };

  return (
    <div className="terminal-container">
      <h4>Simulated Root Terminal</h4>
      <div className="terminal-output">
        {output.map((line, i) => (
          <div key={i} className="terminal-line">{line}</div>
        ))}
      </div>
      <form onSubmit={handleCommand}>
        <span className="prompt">root@honeypot:~#</span>
        <input
          type="text"
          className="terminal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
      </form>
    </div>
  );
}
