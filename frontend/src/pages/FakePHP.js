// 📁 frontend/src/pages/FakePHP.js
import React, { useState } from "react";

export default function FakePHP() {
  const [content, setContent] = useState(`<?php\n// TODO: implement login check\n$password = $_GET['pw'];\necho "Hello " . $_GET['user'];\n?>`);

  return (
    <div>
      <h2>Edit PHP File</h2>
      <textarea
        rows="15"
        cols="80"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <p><strong>Note:</strong> This file is served directly without sanitization.</p>
    </div>
  );
}