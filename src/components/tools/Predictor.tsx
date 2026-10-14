"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Button, Card, ChanceBadge, EmptyState, Input, Segmented, Select } from "@/components/ui";
import { SaveButton } from "@/components/shortlist/ShortlistControls";
import { cutoffLabel } from "@/lib/format";
import { CATEGORIES, chanceFor, closingFor, jeeMainEstimate } from "@/lib/predictor";
import type { Category, Chance, CutoffUnit, Exam, ExamKey } from "@/lib/types";
import s from "./Tools.module.css";

export interface PredictorCollege { slug: string; name: string; fullName: string; nirf: number; cutoff: { exam: ExamKey; close: number; unit: CutoffUnit } }

const DEFAULTS: Partial<Record<ExamKey, string>> = { "JEE Main": "5200", "JEE Advanced": "420", "NEET UG": "300", CAT: "98.8", CLAT: "150", "CUET UG": "99.5", BITSAT: "320", VITEEE: "8000" };
const ORDER: Record<Chance, number> = { safe: 0, likely: 1, reach: 2 };

/** College + rank predictor. Mode and exam live in the URL so results are linkable. */
export function Predictor({ exams, colleges }: { exams: Exam[]; colleges: PredictorCollege[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const mode = params.get("mode") === "rank" ? "rank" : "college";
  const available = exams.filter((e) => colleges.some((c) => c.cutoff.exam === e.key));
  const exam = available.find((e) => e.key === params.get("exam")) ?? available.find((e) => e.key === "JEE Advanced") ?? available[0];

  const [category, setCategory] = useState<Category>("General");
  const [value, setValue] = useState(DEFAULTS[exam?.key ?? "JEE Main"] ?? "");
  const [marks, setMarks] = useState("160");

  const setParam = (patch: Record<string, string | null>) => {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) v === null ? sp.delete(k) : sp.set(k, v);
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
  };

  const results = useMemo(() => {
    if (!exam) return [];
    const v = parseFloat(value);
    if (Number.isNaN(v)) return [];
    return colleges
      .filter((c) => c.cutoff.exam === exam.key)
      .map((c) => {
        const closing = closingFor(c.cutoff.close, c.cutoff.unit, category);
        return { c, closing, chance: chanceFor(v, closing, c.cutoff.unit) };
      })
      .sort((a, b) => ORDER[a.chance] - ORDER[b.chance] || a.c.nirf - b.c.nirf);
  }, [colleges, exam, value, category]);

  const tally = (k: Chance) => results.filter((r) => r.chance === k).length;
  const unit = exam?.unit ?? "rank";
  const unitLabel = unit === "pct" ? "Percentile" : unit === "score" ? "Score" : "Category rank";
  const est = jeeMainEstimate(parseFloat(marks) || 0);

  return (
    <div className={s.stack}>
      <Segmented label="Predictor type" value={mode} onChange={(m) => setParam({ mode: m === "rank" ? "rank" : null })}
        options={[{ value: "college", label: "College predictor" }, { value: "rank", label: "Rank predictor" }]} />

      {mode === "rank" ? (
        <div className={s.two}>
          <Card padding="lg">
            <h2 className={s.h}>JEE Main 2027</h2>
            <div className={s.fields}>
              <Input label="Expected marks (out of 300)" type="number" min={0} max={300} inputMode="numeric" value={marks} onChange={(e) => setMarks(e.target.value)} />
              <Select label="Category" options={CATEGORIES} value={category} onChange={(e) => setCategory(e.target.value as Category)} />
            </div>
            <div className={s.result}>
              <div><span>Percentile</span><b className="num">{est.percentile.toFixed(2)}</b></div>
              <div><span>Expected CRL rank</span><b className="num">{est.rank.toLocaleString("en-IN")}</b></div>
            </div>
            <p className={s.note}>Assumes about 14 lakh candidates and a sample marks-to-percentile curve. Treat it as a range, not a promise.</p>
            <Button variant="primary" iconRight="arrowRight" onClick={() => { setValue(String(est.rank)); setParam({ mode: null, exam: "JEE Main" }); }}>
              Find colleges at this rank
            </Button>
          </Card>
          <Card padding="lg">
            <h2 className={s.h}>How marks map to rank</h2>
            <p className="mute">Percentile rises steeply above 150 marks: each extra mark there is worth thousands of ranks.</p>
          </Card>
        </div>
      ) : exam ? (
        <div className={s.two}>
          <Card padding="lg">
            <h2 className={s.h}>Your details</h2>
            <div className={s.fields}>
              <Select label="Exam" options={available.map((e) => e.key)} value={exam.key}
                onChange={(e) => { setValue(DEFAULTS[e.target.value as ExamKey] ?? ""); setParam({ exam: e.target.value }); }} />
              <Select label="Category" options={CATEGORIES} value={category} onChange={(e) => setCategory(e.target.value as Category)} />
              <Input label={unitLabel} type="number" step={unit === "pct" ? "0.1" : "1"} min={0} inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
            {results.length > 0 && (
              <div className={s.result} data-cols="3">
                <div><span>Safe</span><b className="num tone-green">{tally("safe")}</b></div>
                <div><span>Likely</span><b className="num tone-amber">{tally("likely")}</b></div>
                <div><span>Reach</span><b className="num tone-red">{tally("reach")}</b></div>
              </div>
            )}
            <p className={s.note}>Safe: comfortably inside last year&apos;s closing value. Likely: within a narrow margin. Reach: outside it. Sample data.</p>
          </Card>
          <Card padding="lg">
            <h2 className={s.h}>{results.length || "No"} colleges accept {exam.key}</h2>
            {results.length === 0 ? (
              <EmptyState title={`Enter a ${unitLabel.toLowerCase()} to see your chances.`} />
            ) : (
              <ul className={s.list}>
                {results.map(({ c, closing, chance }) => (
                  <li key={c.slug}>
                    <span className={s.listMain}>
                      <Link href={`/college/${c.slug}`}>{c.fullName}</Link>
                      <span className="num mute">Closing {cutoffLabel(closing, c.cutoff.unit)} · {category}</span>
                    </span>
                    <SaveButton slug={c.slug} name={c.name} />
                    <ChanceBadge chance={chance} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      ) : (
        <EmptyState title="No exams with cutoff data yet." />
      )}
    </div>
  );
}
