import React, { useState } from "react";

export default function Profile() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const upload = async () => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("http://localhost:8080/profile/upload", {
      method: "POST",
      body: form
    });
    const data = await res.json();
    setStatus(data.message);
  };

  return (
    <div className="container mt-4">
      <h2>📁 Profil utilisateur</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} className="form-control" />
      <button className="btn btn-primary mt-3" onClick={upload}>Téléverser</button>
      {status && <div className="alert alert-info mt-3">{status}</div>}
    </div>
  );
}
