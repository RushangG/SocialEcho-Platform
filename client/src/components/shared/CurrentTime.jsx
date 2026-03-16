import { useState, useEffect } from "react";

const CurrentTime = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
  const month = now.toLocaleDateString("en-US", { month: "long" });
  const day = now.getDate();
  const year = now.getFullYear();
  const h = now.getHours() % 12 || 12;
  const time = `${h}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${now.getHours() >= 12 ? "PM" : "AM"}`;

  return (
    <div className="log-time-pill">
      {`${weekday}, ${month} ${day}, ${year} — ${time}`}
    </div>
  );
};

export default CurrentTime;
