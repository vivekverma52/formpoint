"use client";
import { useEffect, useRef, type ReactNode } from "react";
import s from "./AnnouncementTicker.module.css";

/**
 * Scrolling announcement (right to left, on a loop, pauses on hover).
 * Each frame it publishes where the visible text is as CSS variables on its parent
 * (--dim-l / --dim-r / --dim-t / --dim-h), so the parent's grid can dim only the lines
 * behind the text — they fade as the sentence arrives and return one by one as it passes.
 */
export function AnnouncementTicker({ children }: { children: ReactNode }) {
  const strip = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = strip.current, tr = track.current, host = strip.current?.parentElement;
    if (!el || !tr || !host) return;
    let raf = 0;
    const tick = () => {
      const h = host.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      const first = tr.firstElementChild?.getBoundingClientRect();
      const last = tr.lastElementChild?.getBoundingClientRect();
      if (first && last) {
        // Only the part of the text inside the strip is visible; clamp to it.
        const l = Math.max(first.left, b.left) - h.left;
        const r = Math.min(last.right, b.right) - h.left;
        host.style.setProperty("--dim-l", `${r > l ? l : -9999}px`);
        host.style.setProperty("--dim-r", `${r > l ? r : -9999}px`);
        host.style.setProperty("--dim-t", `${b.top - h.top + 1}px`);
        host.style.setProperty("--dim-h", `${b.height - 1}px`);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={strip} className={s.strip}>
      <div ref={track} className={s.track}>{children}</div>
    </div>
  );
}
