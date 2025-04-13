import React from "react";

export default function Profile() {
  return (
    <div className="container mt-4">
      <h2>👤 Profile</h2>
      <ul className="list-group">
        <li className="list-group-item"><strong>Name:</strong> John Doe</li>
        <li className="list-group-item"><strong>Email:</strong> john@securepanel.local</li>
        <li className="list-group-item"><strong>Role:</strong> Administrator</li>
        <li className="list-group-item"><strong>Last Login:</strong> 2 hours ago</li>
      </ul>
    </div>
  );
}
