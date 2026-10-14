import Link from "next/link";
import { EmptyState, Stars } from "@/components/ui";
import { ApplyButton } from "@/components/shortlist/Apply";
import { CompareButton, SaveButton } from "@/components/shortlist/ShortlistControls";
import { lpa } from "@/lib/format";
import type { College } from "@/lib/types";
import { Monogram } from "./Monogram";
import s from "./RankTable.module.css";

/** Ranked college table (home "course-wise top colleges"). Becomes stacked cards on mobile. */
export function RankTable({ colleges }: { colleges: College[] }) {
  if (!colleges.length) return <EmptyState title="No colleges for this course yet." />;
  return (
    <div className={s.table} role="table" aria-label="Ranked colleges">
      <div className={s.head} role="row">
        {["Rank", "College", "Actions", "Placements", "Rating"].map((h) => <div key={h} role="columnheader">{h}</div>)}
      </div>
      {colleges.map((c, i) => (
        <div className={s.row} role="row" key={c.slug}>
          <div className={s.rk} role="cell">#{i + 1}</div>
          <div className={s.col} role="cell">
            <Monogram text={c.short} />
            <div className={s.colText}><Link href={`/college/${c.slug}`}>{c.fullName}</Link><span>{c.city}, {c.state}</span></div>
          </div>
          <div className={s.acts} role="cell">
            <ApplyButton size="sm" iconRight="external" targets={[{ slug: c.slug, name: c.name }]}>Apply</ApplyButton>
            <CompareButton slug={c.slug} name={c.name} />
            <SaveButton slug={c.slug} name={c.name} />
          </div>
          <div className={s.pk} role="cell"><span>Highest<b>{lpa(c.highestLpa)}</b></span><span>Average<b>{lpa(c.averageLpa)}</b></span></div>
          <div className={s.rate} role="cell"><b>{c.rating}</b><Stars value={c.rating} /></div>
        </div>
      ))}
    </div>
  );
}
