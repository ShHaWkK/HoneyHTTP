import React, { useState } from "react";

export default function ProfileUpload() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8080/profile/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setMsg(data.message);
  };

  return (
    <div>
      <h2>Upload Profile Image</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="form-control" />
        <button className="btn btn-success mt-2" type="submit">Upload</button>
      </form>
      {msg && <div className="alert alert-info mt-3">{msg}</div>}
    </div>
  );
}
