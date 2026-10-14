import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, ChipLink, Container, PageHeader } from "@/components/ui";
import { SaveButton } from "@/components/shortlist/ShortlistControls";
import { searchColleges } from "@/lib/api";
import { STREAMS } from "@/lib/data/sample";
import { parseFilters, type RawParams } from "@/lib/filters";
import { lpa, paybackLabel, paybackMonths, paybackTone } from "@/lib/format";
import type { Stream } from "@/lib/types";
import s from "./rankings.module.css";

const AGENCIES = ["NIRF 2025", "India Today 2026", "The Week 2026", "Outlook 2025"] as const;

/** Sample agency ranks derived from NIRF until real feeds are wired in. */
function agencyRanks(slug: string, nirf: number) {
  const h = [...slug].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) % 9973, 7);
  return AGENCIES.map((_, i) => (i === 0 ? nirf : Math.max(1, nirf + (((h + i * 13) % 7) - 3))));
}

type Props = { searchParams: Promise<RawParams> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const stream = STREAMS.find((x) => x.key === sp.stream)?.key ?? "Engineering";
  return {
    title: `Top ${stream} colleges 2026 — NIRF, India Today, The Week, Outlook`,
    description: `Every major ${stream.toLowerCase()} ranking side by side, with average packages and fee payback.`,
    alternates: { canonical: stream === "Engineering" ? "/rankings" : `/rankings?stream=${stream}` },
  };
}

export default async function RankingsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const stream: Stream = STREAMS.find((x) => x.key === sp.stream)?.key ?? "Engineering";
  const { items } = await searchColleges({ ...parseFilters({}), stream });
  const rows = items.filter((c) => c.stream === stream).sort((a, b) => a.nirf - b.nirf);

  return (
    <Container>
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Rankings" }]} />
      <PageHeader eyebrow="Four agencies, one table" title={`Top ${stream} colleges 2026`} description="Every major ranking side by side, so you can see where agencies agree and where a college only looks good on one list." />
      <nav className={s.streams} aria-label="Stream">
        {STREAMS.map((x) => (
          <ChipLink key={x.key} href={x.key === "Engineering" ? "/rankings" : `/rankings?stream=${x.key}`} className={x.key === stream ? s.on : undefined}>{x.label}</ChipLink>
        ))}
      </nav>
      <div className={s.wrap}>
        <table className={s.table}>
          <caption className="sr-only">{stream} college rankings by agency</caption>
          <thead>
            <tr><th scope="col">#</th><th scope="col">College</th>{AGENCIES.map((a, i) => <th key={a} scope="col" className={i === 0 ? s.primary : undefined}>{a}</th>)}<th scope="col">Avg pkg</th><th scope="col">Fees back in</th><th scope="col"><span className="sr-only">Save</span></th></tr>
          </thead>
          <tbody>
            {rows.map((c, i) => {
              const m = paybackMonths(c);
              const tone = paybackTone(m);
              return (
                <tr key={c.slug}>
                  <td className="num">{i + 1}</td>
                  <td><Link href={`/college/${c.slug}`} className={s.name}>{c.name}</Link><span className={s.sub}>{c.city}</span></td>
                  {agencyRanks(c.slug, c.nirf).map((r, j) => <td key={j} className={`num ${j === 0 ? s.primary : ""}`}>#{r}</td>)}
                  <td className="num tone-green">{lpa(c.averageLpa)}</td>
                  <td className={`num ${tone !== "neutral" ? `tone-${tone}` : ""}`}>{paybackLabel(m)}</td>
                  <td><SaveButton slug={c.slug} name={c.name} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className={s.note}>Non-NIRF ranks are sample values for this preview.</p>
    </Container>
  );
}
