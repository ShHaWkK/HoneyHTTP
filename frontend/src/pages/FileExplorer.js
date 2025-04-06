// 📁 frontend/src/pages/FileExplorer.js
import React, { useState } from "react";

export default function FileExplorer() {
  const [path, setPath] = useState("../../../../etc/passwd");
  const [output, setOutput] = useState("");

  const fetchFile = async () => {
    const res = await fetch(`http://localhost:8080/exec?cmd=cat ${encodeURIComponent(path)}`);
    const data = await res.json();
    setOutput(data.result || data.error);
  };

  return (
    <div>
      <h2>File Explorer</h2>
      <input value={path} onChange={e => setPath(e.target.value)} placeholder="Enter path (../../etc/passwd)" />
      <button onClick={fetchFile}>Read File</button>
      <pre>{output}</pre>
    </div>
  );
}
