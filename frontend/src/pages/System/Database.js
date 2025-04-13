import React from "react";

export default function Database() {
  return (
    <div className="container mt-4">
      <h2>🧬 Fake SQL Panel</h2>
      <pre className="bg-dark text-light p-3">
        SELECT * FROM users;<br />
        +----+----------+--------------+<br />
        | ID | Username | Password     |<br />
        +----+----------+--------------+<br />
        | 1  | admin    | admin123     |<br />
        | 2  | root     | toor         |<br />
        | 3  | guest    | welcome      |<br />
        +----+----------+--------------+<br />
      </pre>
    </div>
  );
}
