"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Chip, Icon, Input, Select } from "@/components/ui";
import { CITIES, COURSES } from "@/lib/data/sample";
import { FEE_BANDS, PACKAGE_STEPS, RATING_STEPS, SORTS, parseFilters, toQuery } from "@/lib/filters";
import type { CollegeFilters } from "@/lib/types";
import s from "./FilterPanel.module.css";

type Key = Exclude<keyof CollegeFilters, "sort" | "page">;

/**
 * URL is the state. Every change replaces the query string, so filtered views are
 * shareable, back-button friendly and rendered on the server. Updates run in a
 * transition so the current results stay interactive while new ones stream in.
 */
function useFilterUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();
  const current = parseFilters(Object.fromEntries(params.entries()));
  // SEO landing pages (/colleges/btech-colleges-in-chennai) hand off to /colleges once refined.
  const base = pathname.startsWith("/colleges/") ? "/colleges" : pathname;
  const update = (patch: Partial<CollegeFilters>, seed: Partial<CollegeFilters> = {}) =>
    start(() => router.replace(`${base}${toQuery({ ...seed, ...current, ...patch, page: 1 })}`, { scroll: false }));
  return { current, update, pending };
}

export function FilterPanel({ seed = {} }: { seed?: Partial<CollegeFilters> }) {
  const { current: urlF, update, pending } = useFilterUrl();
  const f = { ...seed, ...urlF } as CollegeFilters;
  const [open, setOpen] = useState(true);
  useEffect(() => { if (window.innerWidth < 960) setOpen(false); }, []);

  const toggle = <K extends Key>(key: K, value: CollegeFilters[K]) =>
    update({ [key]: f[key] === value ? undefined : value } as Partial<CollegeFilters>, seed);

  const group = <K extends Key>(title: string, key: K, opts: readonly { value: CollegeFilters[K]; label: string }[]) => (
    <fieldset className={s.group}>
      <legend>{title}</legend>
      <div className={s.opts}>
        {opts.map((o) => (
          <Chip key={String(o.value)} activeTone="blue" pressed={f[key] === o.value} onClick={() => toggle(key, o.value)}>{o.label}</Chip>
        ))}
      </div>
    </fieldset>
  );

  return (
    <aside className={s.panel} aria-busy={pending}>
      <button type="button" className={s.toggle} aria-expanded={open} aria-controls="filter-body" onClick={() => setOpen((o) => !o)}>
        <span><Icon name="filter" /> Filters</span><Icon name="chevronDown" />
      </button>
      <div id="filter-body" className={s.body} hidden={!open}>
        {group("Course", "course", COURSES.map((c) => ({ value: c.key, label: c.key })))}
        {group("City", "city", CITIES.map((c) => ({ value: c.name, label: c.name })))}
        {group("Annual fee", "fee", FEE_BANDS.map((b) => ({ value: b.id, label: b.label })))}
        {group("Average package", "minPackage", PACKAGE_STEPS.map((p) => ({ value: p, label: `${p} LPA +` })))}
        {group("Rating", "minRating", RATING_STEPS.map((r) => ({ value: r, label: `${r} ★ +` })))}
        {group("Ownership", "ownership", [{ value: "Government" as const, label: "Government" }, { value: "Private" as const, label: "Private" }])}
      </div>
    </aside>
  );
}

/** Search-within-results and sort. Debounced so typing doesn't spam navigations. */
export function ResultsToolbar({ seed = {} }: { seed?: Partial<CollegeFilters> }) {
  const { current, update, pending } = useFilterUrl();
  const [q, setQ] = useState(current.q ?? "");
  useEffect(() => {
    if ((current.q ?? "") === q) return;
    const t = window.setTimeout(() => update({ q: q || undefined }, seed), 300);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);
  return (
    <div className={s.toolbar}>
      <Input label="Filter results" hideLabel type="search" placeholder="Filter by name or city" value={q} onChange={(e) => setQ(e.target.value)} className={s.search} />
      {pending && <span className={s.spinner} role="status" aria-label="Updating results" />}
      <Select label="Sort by" hideLabel options={SORTS.map((o) => ({ value: o.id, label: `Sort: ${o.label}` }))} value={current.sort}
        onChange={(e) => update({ sort: e.target.value as CollegeFilters["sort"] }, seed)} className={s.sort} />
    </div>
  );
}

function labelFor(key: Key, value: unknown): string {
  switch (key) {
    case "fee": return FEE_BANDS.find((b) => b.id === value)?.label ?? String(value);
    case "minPackage": return `${value} LPA+`;
    case "minRating": return `${value}★ +`;
    case "q": return `“${value}”`;
    default: return String(value);
  }
}

/** Removable chips for every active filter. */
export function ActiveFilters({ seed = {} }: { seed?: Partial<CollegeFilters> }) {
  const { current, update } = useFilterUrl();
  const f = { ...seed, ...current };
  const keys: Key[] = ["course", "stream", "city", "state", "ownership", "fee", "minPackage", "minRating", "q"];
  const active = keys.filter((k) => f[k] !== undefined && f[k] !== "");
  if (!active.length) return null;
  return (
    <div className={s.active}>
      {active.map((k) => {
        const v = f[k];
        const label = labelFor(k, v);
        return <Chip key={k} removable onClick={() => update({ [k]: undefined } as Partial<CollegeFilters>, { ...seed, [k]: undefined })} aria-label={`Remove filter ${label}`}>{label}</Chip>;
      })}
      <button type="button" className={s.clear} onClick={() => update({ course: undefined, stream: undefined, city: undefined, state: undefined, ownership: undefined, fee: undefined, minPackage: undefined, minRating: undefined, q: undefined })}>Clear all</button>
    </div>
  );
}
