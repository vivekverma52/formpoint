"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui";
import { CATEGORIES, CATEGORY_SECTIONS, itemHref } from "@/lib/data/categories";
import { cx } from "@/lib/cx";
import s from "./CategoryNav.module.css";

/** Category row under the header. Hover (mouse) or tap opens a panel with that category's four sections. */
export function CategoryNav({ children }: { children?: ReactNode }) {
  const [active, setActive] = useState<string | null>(null);
  const [edges, setEdges] = useState({ start: false, end: false });
  const root = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pathname = usePathname();

  useEffect(() => setActive(null), [pathname]);
  useEffect(() => {
    if (!active) return;
    const onDoc = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setActive(null); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(null); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [active]);
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Track which sides have more categories to scroll to (drives the arrows and edge fades).
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const update = () => setEdges({ start: el.scrollLeft > 4, end: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", update); ro.disconnect(); };
  }, []);
  // Both arrow slots stay reserved while the row overflows, so the row doesn't jump as one hides.
  const overflow = edges.start || edges.end;
  const scroll = (dir: 1 | -1) => row.current?.scrollBy({ left: dir * row.current.clientWidth * 0.6, behavior: "smooth" });

  const keepOpen = () => clearTimeout(closeTimer.current);
  const closeSoon = () => { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setActive(null), 150); };
  const cat = CATEGORIES.find((c) => c.slug === active);

  return (
    <div ref={root} className={s.root} onPointerEnter={keepOpen} onPointerLeave={(e) => e.pointerType === "mouse" && closeSoon()}>
      <div className={cx(s.bar, edges.start && s.fadeStart, edges.end && s.fadeEnd)}>
        {overflow && <button type="button" className={s.arrow} disabled={!edges.start} aria-label="Scroll categories left" onClick={() => scroll(-1)}><Icon name="chevronLeft" size={18} /></button>}
        <nav ref={row} className={s.row} aria-label="Categories">
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              type="button"
              className={cx(s.tab, c.slug === active && s.on)}
              aria-expanded={c.slug === active}
              aria-controls="category-panel"
              onPointerEnter={(e) => { if (e.pointerType === "mouse") { keepOpen(); setActive(c.slug); } }}
              onClick={() => setActive((a) => (a === c.slug ? null : c.slug))}
            >
              {c.label}
              <Icon name="chevronDown" size={12} />
            </button>
          ))}
          {children && <><span className={s.sep} aria-hidden />{children}</>}
        </nav>
        {overflow && <button type="button" className={s.arrow} disabled={!edges.end} aria-label="Scroll categories right" onClick={() => scroll(1)}><Icon name="chevronRight" size={18} /></button>}
      </div>
      <div id="category-panel" className={s.panel} hidden={!cat}>
        {cat && (
          <div className={s.inner}>
            <div className={s.head}>
              <b>{cat.label}</b>
              <Link href={`/category/${cat.slug}`} className={s.all}>View all <Icon name="arrowRight" size={14} /></Link>
            </div>
            <div className={s.cols}>
              {CATEGORY_SECTIONS.map((sec) => (
                <div key={sec.key}>
                  <h4>{sec.title}</h4>
                  <ul>
                    {cat[sec.key].map((it) => <li key={it.label}><Link href={itemHref(cat, sec, it)}>{it.label}</Link></li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
