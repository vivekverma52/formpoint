"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";
import { CITIES, COURSES } from "@/lib/data/sample";
import { collegesHref, FEE_BANDS, PACKAGE_STEPS, RATING_STEPS } from "@/lib/filters";
import type { CourseKey } from "@/lib/types";
import s from "./MegaMenu.module.css";

/** "Explore" disclosure: pick a course, then jump to it by city, fee, package or rating. */
export function MegaMenu() {
  const [open, setOpen] = useState(false);
  const [course, setCourse] = useState<CourseKey>("B.Tech");
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const col = (title: string, links: { href: string; label: string }[]) => (
    <div>
      <h4>{title}</h4>
      <ul>{links.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
    </div>
  );

  return (
    <div ref={root} className={s.root}>
      <Button iconLeft="grid" aria-expanded={open} aria-controls="mega-panel" onClick={() => setOpen((o) => !o)}>
        <span className={s.label}>Explore</span>
      </Button>
      <div id="mega-panel" className={s.panel} hidden={!open}>
        <div className={s.inner}>
          <div className={s.courses} role="tablist" aria-label="Courses">
            {COURSES.map((c) => (
              <button key={c.key} type="button" role="tab" aria-selected={c.key === course} onClick={() => setCourse(c.key)}>{c.key}</button>
            ))}
          </div>
          <div className={s.cols} role="tabpanel">
            {col("Top colleges in", CITIES.map((c) => ({ href: collegesHref({ course, city: c.name }), label: `${course} in ${c.name}` })))}
            {col("By annual fee", FEE_BANDS.map((b) => ({ href: collegesHref({ course, fee: b.id }), label: b.label })))}
            {col("By average package", PACKAGE_STEPS.map((p) => ({ href: collegesHref({ course, minPackage: p }), label: `${p} LPA and above` })))}
            {col("By rating", RATING_STEPS.map((r) => ({ href: collegesHref({ course, minRating: r }), label: `${r} stars and above` })))}
          </div>
        </div>
      </div>
    </div>
  );
}
