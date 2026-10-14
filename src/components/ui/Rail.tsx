"use client";
import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Icon } from "./Icon";
import s from "./Rail.module.css";

export interface RailProps {
  children: ReactNode;
  /** Minimum card width; cards grow to fill. */
  itemMinWidth?: number;
  /** Auto-advance interval in ms. Pauses on hover, focus, touch and hidden tabs; off for reduced motion. */
  autoplayMs?: number;
  showDots?: boolean;
  /** Accessible name for the carousel region. */
  label: string;
  className?: string;
}

/**
 * Horizontal scroll-snap carousel with arrow buttons and optional dots + autoplay.
 * Native scrolling stays intact (swipe, trackpad, keyboard), so it works before hydration.
 */
export function Rail({ children, itemMinWidth = 260, autoplayMs, showDots, label, className }: RailProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const [page, setPage] = useState({ cur: 0, total: 1 });
  const paused = useRef(false);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth - 2;
    setEdge({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max });
    const total = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth - 0.05));
    setPage({ total, cur: el.scrollLeft >= max ? total - 1 : Math.round(el.scrollLeft / Math.max(1, el.clientWidth)) });
  }, []);

  const step = useCallback((dir: 1 | -1, single = false) => {
    const el = ref.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 12;
    const w = first.getBoundingClientRect().width + gap;
    const n = single ? 1 : Math.max(1, Math.floor(el.clientWidth / w));
    el.scrollBy({ left: dir * w * n, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    return () => { ro.disconnect(); el.removeEventListener("scroll", measure); };
  }, [measure]);

  useEffect(() => {
    if (!autoplayMs || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      const el = ref.current;
      if (!el || paused.current || document.hidden) return;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) el.scrollTo({ left: 0, behavior: "smooth" });
      else step(1, true);
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [autoplayMs, step]);

  const pause = () => { paused.current = true; };
  const resume = () => { paused.current = false; };

  return (
    <section aria-roledescription="carousel" aria-label={label} className={cx(s.root, className)}
      onMouseEnter={pause} onMouseLeave={resume} onFocus={pause} onBlur={resume}
      onTouchStart={pause} onTouchEnd={() => window.setTimeout(resume, 4000)}>
      <div className={s.box}>
        <div ref={ref} className={s.track} style={{ gridAutoColumns: `minmax(${itemMinWidth}px, 1fr)` }} tabIndex={0}>
          {Children.map(children, (child) => <div className={s.item}>{child}</div>)}
        </div>
        <button type="button" className={cx(s.nav, s.prev)} onClick={() => step(-1)} disabled={edge.start} aria-label="Scroll left">
          <Icon name="chevronLeft" />
        </button>
        <button type="button" className={cx(s.nav, s.next)} onClick={() => step(1)} disabled={edge.end} aria-label="Scroll right">
          <Icon name="chevronRight" />
        </button>
      </div>
      {showDots && page.total > 1 && (
        <div className={s.dots}>
          {Array.from({ length: page.total }, (_, i) => (
            <button key={i} type="button" aria-label={`Go to page ${i + 1}`} aria-current={i === page.cur}
              onClick={() => ref.current?.scrollTo({ left: i * ref.current.clientWidth, behavior: "smooth" })} />
          ))}
        </div>
      )}
    </section>
  );
}
