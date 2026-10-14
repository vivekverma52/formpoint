"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { EmptyState, IconButton, Select } from "@/components/ui";
import { ApplyButton } from "@/components/shortlist/Apply";
import { MAX_COMPARE, compareStore, toggleCompare, useCompare } from "@/components/shortlist/stores";
import { Monogram } from "@/components/college/Monogram";
import { cutoffLabel, lakh, lpa, paybackLabel, paybackMonths } from "@/lib/format";
import type { College } from "@/lib/types";
import s from "./Tools.module.css";

type Row = { label: string; render: (c: College) => ReactNode; score?: (c: College) => number | null; lowerIsBetter?: boolean };

const ROWS: Row[] = [
  { label: "Ownership", render: (c) => c.ownership },
  { label: "Established", render: (c) => <span className="num">{c.established}</span> },
  { label: "NIRF rank", render: (c) => <span className="num">#{c.nirf} {c.stream}</span>, score: (c) => c.nirf, lowerIsBetter: true },
  { label: "Fees from / yr", render: (c) => <span className="num">{lakh(Math.min(...c.programmes.map((p) => p.feePerYear)))}</span>, score: (c) => Math.min(...c.programmes.map((p) => p.feePerYear)), lowerIsBetter: true },
  { label: "Average package", render: (c) => <span className="num">{lpa(c.averageLpa)}</span>, score: (c) => c.averageLpa },
  { label: "Highest package", render: (c) => <span className="num">{lpa(c.highestLpa)}</span>, score: (c) => c.highestLpa },
  { label: "Fees back in", render: (c) => <span className="num">{paybackLabel(paybackMonths(c))}</span>, score: (c) => paybackMonths(c), lowerIsBetter: true },
  { label: "Placed", render: (c) => <span className="num">{c.placedPct ? `${c.placedPct}%` : "—"}</span>, score: (c) => c.placedPct },
  { label: "Rating", render: (c) => <span className="num">{c.rating} / 5</span>, score: (c) => c.rating },
  { label: "Admission", render: (c) => (c.cutoff ? <>{c.cutoff.exam} · <span className="num">{cutoffLabel(c.cutoff.close, c.cutoff.unit)}</span></> : "Institute test") },
  { label: "Top recruiters", render: (c) => c.recruiters.slice(0, 3).join(", ") || "—" },
];

/** Side-by-side comparison. Best value per row is marked in green with a ▲ (not colour alone). */
export function CompareView({ colleges }: { colleges: College[] }) {
  const slugs = useCompare();
  const sel = slugs.map((sl) => colleges.find((c) => c.slug === sl)).filter((c): c is College => Boolean(c));

  const best = (row: Row) => {
    if (!row.score || sel.length < 2) return null;
    const vals = sel.map(row.score).filter((v): v is number => v != null);
    if (vals.length < 2) return null;
    return row.lowerIsBetter ? Math.min(...vals) : Math.max(...vals);
  };

  return (
    <div className={s.stack}>
      <div className={s.slots}>
        {Array.from({ length: MAX_COMPARE }, (_, i) => {
          const c = sel[i];
          if (c) {
            return (
              <div key={c.slug} className={`${s.slot} ${s.slotFull}`}>
                <div className={s.slotTop}><Monogram text={c.short} /><IconButton icon="close" size="sm" label={`Remove ${c.name}`} onClick={() => toggleCompare(c.slug)} /></div>
                <h3><Link href={`/college/${c.slug}`}>{c.fullName}</Link></h3>
                <span className="mute">{c.city}, {c.state}</span>
                <ApplyButton size="sm" targets={[{ slug: c.slug, name: c.name }]}>Apply</ApplyButton>
              </div>
            );
          }
          return (
            <div key={`empty-${i}`} className={s.slot}>
              <span className="eyebrow">Slot {i + 1}</span>
              <Select label="Add a college" value="" onChange={(e) => e.target.value && compareStore.set((p) => [...p, e.target.value])}
                options={[{ value: "", label: "Choose…" }, ...colleges.filter((c) => !slugs.includes(c.slug)).map((c) => ({ value: c.slug, label: c.name }))]} />
            </div>
          );
        })}
      </div>

      {sel.length === 0 ? (
        <EmptyState title="Nothing to compare yet." description="Add a college above, or use Compare on any listing." />
      ) : (
        <div className={s.tableWrap}>
          <table className={s.table} style={{ minWidth: 180 + sel.length * 200 }}>
            <caption className="sr-only">Comparison of {sel.map((c) => c.name).join(", ")}</caption>
            <thead><tr><td /> {sel.map((c) => <th key={c.slug} scope="col">{c.name}</th>)}</tr></thead>
            <tbody>
              {ROWS.map((row) => {
                const b = best(row);
                return (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {sel.map((c) => {
                      const win = b != null && row.score?.(c) === b;
                      return <td key={c.slug} className={win ? s.win : undefined}>{row.render(c)}{win && <span className="sr-only"> (best)</span>}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
