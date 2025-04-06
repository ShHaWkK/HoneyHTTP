export function startTracking() {
    const session = Date.now();
  
    const log = (event, detail) => {
      fetch("http://localhost:8080/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, detail, session }),
      });
    };
  
    window.addEventListener("click", (e) => {
      log("click", { x: e.clientX, y: e.clientY });
    });
  
    window.addEventListener("keydown", (e) => {
      log("key", { key: e.key });
    });
  
    window.addEventListener("mousemove", (e) => {
      if (Math.random() < 0.01) log("move", { x: e.clientX, y: e.clientY });
    });
  }
  