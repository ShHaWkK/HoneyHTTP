import React from "react";

export default function Database() {
  return (
    <div>
      <h2>Fake SQL Viewer</h2>
      <pre className="bg-dark text-white p-3 rounded">
        SELECT * FROM users;<br />
        +----+----------+--------------+<br />
        | ID | Username | Password     |<br />
        +----+----------+--------------+<br />
        | 1  | admin    | admin123     |<br />
        | 2  | root     | toor         |<br />
        | 3  | sys      | pass@root    |<br />
        +----+----------+--------------+<br />
      </pre>
    </div>
  );
}
