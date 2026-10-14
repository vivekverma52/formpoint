"use client";
import { useRouter } from "next/navigation";
import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/ui";
import { cx } from "@/lib/cx";
import { CITIES, COURSES } from "@/lib/data/sample";
import { collegesHref } from "@/lib/filters";
import s from "./SearchBox.module.css";

export interface SearchIndexItem { slug: string; name: string; fullName: string; short: string; city: string }
interface Suggestion { href: string; label: string; kind: "College" | "Course" | "City" }

/**
 * Accessible combobox (WAI-ARIA 1.2 pattern): arrow keys move, Enter opens,
 * Escape closes. Suggestions come from a small prop index today; swap
 * `suggest()` for a Typesense query as the dataset grows.
 */
export function SearchBox({ index, variant = "header", placeholder = "Search colleges, courses, cities" }: { index: SearchIndexItem[]; variant?: "header" | "hero"; placeholder?: string }) {
  const router = useRouter();
  const id = useId();
  const listId = `${id}-list`;
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const blurTimer = useRef<number | undefined>(undefined);

  const items = useMemo<Suggestion[]>(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return [
      ...index.filter((c) => `${c.name} ${c.fullName} ${c.short} ${c.city}`.toLowerCase().includes(t)).slice(0, 5)
        .map((c) => ({ href: `/college/${c.slug}`, label: c.fullName, kind: "College" as const })),
      ...COURSES.filter((c) => `${c.key} ${c.fullName}`.toLowerCase().includes(t)).slice(0, 3)
        .map((c) => ({ href: collegesHref({ course: c.key }), label: `${c.key} colleges`, kind: "Course" as const })),
      ...CITIES.filter((c) => c.name.toLowerCase().includes(t)).slice(0, 2)
        .map((c) => ({ href: collegesHref({ city: c.name }), label: `Colleges in ${c.name}`, kind: "City" as const })),
    ].slice(0, 8);
  }, [q, index]);

  const go = (href: string) => { setOpen(false); setQ(""); router.push(href); };
  const submit = () => { const v = q.trim(); if (v) go(collegesHref({ q: v })); };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!items.length) return;
      e.preventDefault(); setOpen(true);
      setActive((i) => (i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = items[active];
      if (open && pick) go(pick.href); else submit();
    } else if (e.key === "Escape") {
      setOpen(false); setActive(-1);
    }
  };

  const showList = open && items.length > 0;
  return (
    <form role="search" className={cx(s.box, s[variant])} onSubmit={(e) => { e.preventDefault(); submit(); }}>
      <Icon name="search" size={variant === "hero" ? 18 : 16} className={s.icon} />
      <label htmlFor={`${id}-input`} className="sr-only">Search</label>
      <input
        id={`${id}-input`}
        type="search"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && active >= 0 ? `${id}-opt-${active}` : undefined}
        autoComplete="off"
        placeholder={placeholder}
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1); }}
        onFocus={() => { window.clearTimeout(blurTimer.current); setOpen(true); }}
        onBlur={() => { blurTimer.current = window.setTimeout(() => setOpen(false), 120); }}
        onKeyDown={onKey}
      />
      {variant === "hero" && <button type="submit" className={s.submit}>Search</button>}
      <ul id={listId} role="listbox" className={s.list} hidden={!showList}>
        {items.map((it, i) => (
          <li key={it.href + it.label} id={`${id}-opt-${i}`} role="option" aria-selected={i === active}
            onMouseDown={(e) => e.preventDefault()} onClick={() => go(it.href)} className={s.option}>
            <Icon name={it.kind === "College" ? "cap" : it.kind === "City" ? "pin" : "arrowRight"} />
            <span className={s.label}>{it.label}</span>
            <span className={s.kind}>{it.kind}</span>
          </li>
        ))}
      </ul>
    </form>
  );
}
