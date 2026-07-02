"use client";

import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/Chicago",
});

/** Live Dallas clock for the footer. Renders empty on the server, fills on mount. */
export function LocalTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => setTime(fmt.format(new Date()).toLowerCase());
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span suppressHydrationWarning className="tabular-nums">
      {time ? `${time} local` : "dallas time"}
    </span>
  );
}
