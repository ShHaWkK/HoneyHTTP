import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";

export default function Analytics() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/trackings")
      .then((res) => res.text())
      .then((data) => {
        const lines = data.split("\n").filter((l) => l.includes("TRACK"));
        setSessions(lines);
        drawChart(lines.length);
      });
  }, []);

  const drawChart = (value) => {
    const ctx = document.getElementById("sessionChart");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Sessions piégées"],
        datasets: [{
          label: "Nombre de sessions",
          data: [value],
          backgroundColor: "rgba(255, 99, 132, 0.5)"
        }]
      }
    });
  };

  return (
    <div className="container mt-4">
      <h2>📊 User Behavior Analytics</h2>
      <canvas id="sessionChart" height="100"></canvas>
      <h5 className="mt-4">Sessions Trackées :</h5>
      <pre className="bg-light p-3">{sessions.slice(0, 10).join("\n")}</pre>
    </div>
  );
}
