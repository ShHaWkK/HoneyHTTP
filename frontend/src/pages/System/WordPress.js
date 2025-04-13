import React from "react";

export default function WordPress() {
  return (
    <div>
      <h2>wp-config.php</h2>
      <pre>{`
<?php
/** WordPress base configuration */
define( 'DB_NAME', 'wordpress_db' );
define( 'DB_USER', 'root' );
define( 'DB_PASSWORD', 'toor' );
define( 'AUTH_KEY', 'faketoken-123456' );
define( 'SECURE_AUTH_KEY', 'insecure-key' );
?>
      `}</pre>
      <p><strong>Danger:</strong> This file is world-readable.</p>
    </div>
  );
}