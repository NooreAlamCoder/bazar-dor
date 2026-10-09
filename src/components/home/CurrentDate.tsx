
"use client";

import { useEffect, useState } from "react";

function getBanglaDate() {
  return new Intl.DateTimeFormat("bn-BD", {
    timeZone: "Asia/Dhaka",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export default function CurrentDate() {
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateDate = () => setDate(getBanglaDate());

    updateDate();

    const interval = window.setInterval(updateDate, 30_000);

    return () => window.clearInterval(interval);
  }, []);

  return <>{date || "তারিখ লোড হচ্ছে..."}</>;
}
