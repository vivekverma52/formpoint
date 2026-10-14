import Link from "next/link";
import { Badge, Button } from "@/components/ui";
import { ApplyButton } from "@/components/shortlist/Apply";
import { CompareButton, SaveButton } from "@/components/shortlist/ShortlistControls";
import { lakh, lpa, paybackLabel, paybackMonths, paybackTone, programmeFor } from "@/lib/format";
import type { College, CourseKey } from "@/lib/types";
import { Monogram } from "./Monogram";
import s from "./CollegeRow.module.css";

export interface CollegeRowProps {
  college: College;
  /** Position in the ranked list (1-based). */
  position: number;
  /** When set, fee and payback reflect this course instead of the flagship programme. */
  course?: CourseKey;
}

/** Listing result. Server-rendered; only the action buttons hydrate. */
export function CollegeRow({ college: c, position, course }: CollegeRowProps) {
  const p = programmeFor(c, course);
  const m = paybackMonths(c, course);
  const tone = paybackTone(m);
  return (
    <article className={s.row} data-sponsored={c.sponsored || undefined} aria-labelledby={`c-${c.slug}`}>
      <div className={s.rank} aria-label={`Position ${position}`}>#{position}</div>
      <Monogram text={c.short} />
      <div className={s.main}>
        <h3 id={`c-${c.slug}`} className={s.title}><Link href={`/college/${c.slug}`}>{c.fullName}</Link></h3>
        <p className={s.loc}>{c.city}, {c.state}</p>
        <div className={s.tags}>
          {c.sponsored && <Badge tone="amber">Sponsored</Badge>}
          <Badge tone="blue">NIRF #{c.nirf} {c.stream}</Badge>
          <Badge>Estd {c.established}</Badge>
          <Badge>{c.ownership}</Badge>
          {c.cutoff && <Badge>{c.cutoff.exam}</Badge>}
          {tone === "green" && <Badge tone="green">High ROI</Badge>}
        </div>
        <dl className={s.kpis}>
          <div><dt>{course ?? "Fee"} / yr</dt><dd>{lakh(p.feePerYear)}</dd></div>
          <div><dt>Avg package</dt><dd className="tone-green">{lpa(c.averageLpa)}</dd></div>
          <div><dt>Highest</dt><dd>{lpa(c.highestLpa)}</dd></div>
          <div><dt>Fees back in</dt><dd className={tone !== "neutral" ? `tone-${tone}` : undefined}>{paybackLabel(m)}</dd></div>
          <div><dt>Rating</dt><dd>{c.rating} / 5</dd></div>
        </dl>
      </div>
      <div className={s.actions}>
        <ApplyButton size="sm" targets={[{ slug: c.slug, name: c.name }]} course={course}>Apply now</ApplyButton>
        <div className={s.pair}>
          <CompareButton slug={c.slug} name={c.name} />
          <SaveButton slug={c.slug} name={c.name} />
        </div>
        <Button size="sm" href={`/college/${c.slug}`}>View college</Button>
      </div>
    </article>
  );
}
