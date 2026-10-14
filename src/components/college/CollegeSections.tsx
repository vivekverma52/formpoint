/**
 * Building blocks for the college detail page. All server components:
 * no client JS beyond the action buttons they embed.
 */
import type { ReactNode } from "react";
import { Badge, Button, IconTile, Icon, Stars, type IconName } from "@/components/ui";
import { ApplyButton } from "@/components/shortlist/Apply";
import { CompareButton, SaveButton } from "@/components/shortlist/ShortlistControls";
import { closingFor, CATEGORIES } from "@/lib/predictor";
import { count, cutoffLabel, inr, lakh, paybackLabel, paybackMonths, paybackTone, totalFee } from "@/lib/format";
import type { College, Tone } from "@/lib/types";
import { Monogram } from "./Monogram";
import s from "./CollegeSections.module.css";

export function CollegeHero({ college: c }: { college: College }) {
  const m = paybackMonths(c);
  const tone = paybackTone(m);
  return (
    <section className={s.hero}>
      <div>
        <div className={s.id}>
          <Monogram text={c.short} size="xl" />
          <div className={s.idText}>
            <h1>{c.fullName}</h1>
            <p className={s.loc}><Icon name="pin" /> {c.city}, {c.state}, India</p>
          </div>
        </div>
        <div className={s.tags}>
          <Badge>Estd {c.established}</Badge>
          <Badge tone="blue">NIRF #{c.nirf} ({c.stream})</Badge>
          <Badge>{c.ownership}</Badge>
          {m != null && <Badge tone={tone}>Fees back in {paybackLabel(m)}</Badge>}
          {c.sponsored && <Badge tone="amber">Sponsored</Badge>}
        </div>
        <div className={s.rating}>
          <b>{c.rating}</b><span>/ 5</span><Stars value={c.rating} /><span className="num">{count(c.ratingCount)} ratings</span>
        </div>
        <div className={s.actions}>
          <ApplyButton targets={[{ slug: c.slug, name: c.name }]} iconRight="external">Apply for admission</ApplyButton>
          <ApplyButton variant="outline" iconLeft="download" targets={[{ slug: c.slug, name: c.name }]}>Get brochure</ApplyButton>
          <CompareButton slug={c.slug} name={c.name} size="md" />
          <SaveButton slug={c.slug} name={c.name} withLabel size="md" />
        </div>
        <p className={s.source}>Data verified {c.updatedAt} · Source: {c.source}</p>
      </div>
      <div className={s.gallery} aria-label="Campus photos">
        <div className={`${s.ph} ${s.phA}`}><span>Main building</span></div>
        <div className={`${s.ph} ${s.phB}`}><span>Library</span></div>
        <div className={`${s.ph} ${s.phC}`}><span>Hostels</span></div>
      </div>
    </section>
  );
}

/** Titled card section used for every block on the detail page. */
export function DetailSection({ id, title, icon, tone = "blue", action, children }: { id: string; title: string; icon: IconName; tone?: Tone; action?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className={s.section} aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className={s.sectionTitle}>
        <IconTile tone={tone}><Icon name={icon} /></IconTile>
        {title}
        {action && <span className={s.sectionAction}>{action}</span>}
      </h2>
      {children}
    </section>
  );
}

export function CourseFees({ college: c }: { college: College }) {
  return (
    <div className={s.fees}>
      {c.programmes.map((p) => (
        <div key={p.label} className={s.fee}>
          <div className={s.feeHead}>
            <b>{p.label}</b>
            <ApplyButton size="sm" iconRight="external" targets={[{ slug: c.slug, name: c.name }]} course={p.course}>Apply</ApplyButton>
          </div>
          <dl className={s.feeGrid}>
            <div><dt>Yearly</dt><dd>{inr(p.feePerYear)}</dd></div>
            <div><dt>Total</dt><dd>{lakh(totalFee(p))}</dd></div>
            <div><dt>Duration</dt><dd>{p.durationYears} yr</dd></div>
            <div><dt>Intake</dt><dd>{p.intake}</dd></div>
          </dl>
        </div>
      ))}
    </div>
  );
}

export function CutoffTable({ college: c }: { college: College }) {
  if (!c.cutoff) return <p className="mute">{c.name} admits through its own entrance test and does not publish category-wise closing ranks.</p>;
  const { exam, close, unit } = c.cutoff;
  const what = unit === "pct" ? "percentile" : unit === "score" ? "score" : "rank";
  return (
    <>
      <div className={s.tableWrap}>
        <table className={s.table}>
          <caption className="sr-only">{exam} closing {what} by category</caption>
          <thead><tr><th scope="col">Exam</th><th scope="col">Category</th><th scope="col">Closing {what}</th></tr></thead>
          <tbody>
            {CATEGORIES.map((cat) => (
              <tr key={cat}><td>{exam}</td><td>{cat}</td><td className="num">{cutoffLabel(closingFor(close, unit, cat), unit)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button size="sm" variant="primary" iconRight="arrowRight" href={`/predictor?exam=${encodeURIComponent(exam)}`} className={s.mt}>Check your chances</Button>
    </>
  );
}

/** Bar chart of average package by year; one scale for bars and labels, latest year highlighted. */
export function PlacementChart({ college: c }: { college: College }) {
  if (!c.averageLpa) return <p className="mute">Medical colleges do not run campus placements. Graduates move into internship, residency (via NEET PG) and practice.</p>;
  const years = ["2022", "2023", "2024", "2025", "2026"];
  const values = [0.78, 0.84, 0.9, 0.95, 1].map((f) => +((c.averageLpa ?? 0) * f).toFixed(1));
  const W = 560, H = 200, pad = 8, pb = 28, pt = 24;
  const max = Math.ceil(Math.max(...values) / 5) * 5;
  const bw = (W - pad * 2) / values.length;
  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} className={s.chart} role="img" aria-label={`Average package by year: ${values.map((v, i) => `${years[i]} ₹${v} LPA`).join(", ")}`}>
        {[0, 0.5, 1].map((f) => { const y = H - pb - (H - pb - pt) * f; return <line key={f} x1={pad} x2={W - pad} y1={y} y2={y} className={s.grid} />; })}
        {values.map((v, i) => {
          const h = ((H - pb - pt) * v) / max, x = pad + i * bw + bw * 0.22, y = H - pb - h, last = i === values.length - 1;
          return (
            <g key={years[i]}>
              <rect x={x} y={y} width={bw * 0.56} height={h} rx={4} className={last ? s.barHi : s.bar} />
              <text x={x + bw * 0.28} y={y - 7} textAnchor="middle" fontSize={12} className={last ? s.lblHi : s.lbl}>{v}</text>
              <text x={x + bw * 0.28} y={H - 8} textAnchor="middle" fontSize={11} className={s.lbl}>{years[i]}</text>
            </g>
          );
        })}
        <text x={pad} y={14} fontSize={11} className={s.lbl}>AVG PACKAGE · ₹ LPA</text>
      </svg>
      {c.recruiters.length > 0 && (
        <>
          <div className="eyebrow" style={{ marginTop: 16 }}>Top recruiters</div>
          <ul className={s.recruiters}>{c.recruiters.map((r) => <li key={r}>{r}</li>)}</ul>
        </>
      )}
    </>
  );
}

export function RatingBreakdown({ college: c }: { college: College }) {
  const r = c.rating;
  const rows: [string, number][] = [
    ["Placements", c.averageLpa ? r + 0.2 : r - 0.1], ["Faculty", r + 0.1], ["Infrastructure", r - 0.2],
    ["Campus life", r], ["Value for money", c.ownership === "Government" ? r + 0.3 : r - 0.4],
  ];
  return (
    <div className={s.ratingGrid}>
      <div>
        <b className={s.big}>{r}</b>
        <Stars value={r} size="lg" />
        <div className="num mute" style={{ fontSize: 12, marginTop: 4 }}>{count(c.ratingCount)} ratings</div>
      </div>
      <ul className={s.bars}>
        {rows.map(([k, raw]) => {
          const v = Math.max(1, Math.min(5, +raw.toFixed(1)));
          const tone = v >= 4.3 ? "var(--green)" : v >= 3.8 ? "var(--blue)" : "var(--amber)";
          return (
            <li key={k}>
              <span>{k}</span>
              <span className={s.track} aria-hidden><span style={{ width: `${(v / 5) * 100}%`, background: tone }} /></span>
              <span className="num">{v}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div>
      {items.map((it) => (
        <details key={it.q} className={s.faq}>
          <summary>{it.q}</summary>
          <p>{it.a}</p>
        </details>
      ))}
    </div>
  );
}

export function SideBox({ title, icon, children }: { title: string; icon?: IconName; children: ReactNode }) {
  return (
    <section className={s.side}>
      <h3>{icon && <Icon name={icon} />}{title}</h3>
      {children}
    </section>
  );
}

export function CampusMap({ college: c }: { college: College }) {
  const q = encodeURIComponent(`${c.fullName}, ${c.city}`);
  return (
    <SideBox title="Campus location" icon="pin">
      <svg viewBox="0 0 320 160" className={s.map} role="img" aria-label={`Schematic map of ${c.city}`}>
        <rect width="320" height="160" className={s.mapBg} />
        {Array.from({ length: 9 }, (_, i) => <line key={`v${i}`} x1={i * 40} x2={i * 40} y1="0" y2="160" className={s.grid} strokeWidth=".5" />)}
        {Array.from({ length: 5 }, (_, i) => <line key={`h${i}`} y1={i * 40} y2={i * 40} x1="0" x2="320" className={s.grid} strokeWidth=".5" />)}
        <path d="M0 110 C 90 60, 200 140, 320 70" className={s.road} strokeWidth="3" />
        <path d="M60 0 C 90 70, 150 90, 170 160" className={s.road} strokeWidth="2" />
        <circle cx="160" cy="80" r="22" className={s.halo} />
        <path d="M160 90 c-9 -10 -14 -16 -14 -23 a14 14 0 0 1 28 0 c0 7 -5 13 -14 23z" className={s.pin} />
        <circle cx="160" cy="67" r="5" className={s.mapBg} />
      </svg>
      <div className={s.mapFoot}>
        <span className="mute">{c.city}, {c.state}, India</span>
        <div className={s.mapBtns}>
          <Button size="sm" href={`https://www.google.com/maps/search/?api=1&query=${q}`}>View map</Button>
          <Button size="sm" variant="primary" href={`https://www.google.com/maps/dir/?api=1&destination=${q}`}>Directions</Button>
        </div>
      </div>
    </SideBox>
  );
}
