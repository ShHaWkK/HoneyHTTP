// 📁 frontend/src/pages/XSSForm.js
import React, { useState, useEffect } from "react";

export default function XSSForm() {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");

  const fetchComments = async () => {
    const res = await fetch("http://localhost:8081/comments");
    const data = await res.json();
    setComments(data.comments);
  };

  const submit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:8081/comment", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ message: input }),
    });
    setInput("");
    fetchComments();
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div>
      <h2>Public Comments</h2>
      <form onSubmit={submit}>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
      <div className="comments">
        {comments.map((c, i) => (
          <div key={i} dangerouslySetInnerHTML={{ __html: c }} />
        ))}
      </div>
    </div>
  );
}