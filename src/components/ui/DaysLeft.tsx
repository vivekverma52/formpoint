"use client";
import { useEffect, useState } from "react";
import { daysUntil } from "@/lib/format";

/**
 * Day countdown that stays correct on ISR-cached pages: the server renders its
 * best value, then the client recomputes against the viewer's clock.
 */
export function DaysLeft({ date, serverDays }: { date: string; serverDays: number }) {
  const [days, setDays] = useState(serverDays);
  useEffect(() => setDays(daysUntil(date)), [date]);
  return <span suppressHydrationWarning>{days}</span>;
}
