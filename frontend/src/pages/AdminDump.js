import React, { useState } from "react";

export default function AdminDump() {
  const [filter, setFilter] = useState("");
  const [dump, setDump] = useState("");

  const getDump = async () => {
    const res = await fetch(`http://localhost:8081/dump?filter=${encodeURIComponent(filter)}`);
    const data = await res.json();
    setDump(data.dump);
  };

  return (
    <div>
      <h2>SQL Dump Viewer</h2>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Ex: 1=1" className="form-control" />
      <button className="btn btn-warning mt-2" onClick={getDump}>Get Dump</button>
      <pre className="mt-4">{dump}</pre>
    </div>
  );
}
