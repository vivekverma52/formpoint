/** Pure, framework-free predictor logic — unit-test this, not the UI. */
import type { Category, Chance, CutoffUnit } from "./types";

/** [rank multiplier, percentile/score relaxation] per category. Sample values. */
export const CATEGORY_RELAX: Record<Category, [number, number]> = {
  General: [1, 0],
  EWS: [1.3, 0.6],
  OBC: [1.6, 1.2],
  SC: [4.5, 4],
  ST: [7, 6],
};
export const CATEGORIES = Object.keys(CATEGORY_RELAX) as Category[];

export function closingFor(close: number, unit: CutoffUnit, cat: Category): number {
  const [mult, relax] = CATEGORY_RELAX[cat];
  if (unit === "pct") return +(close - relax).toFixed(1);
  if (unit === "score") return Math.round(close - relax * 12);
  return Math.round(close * mult);
}

/** Higher is better for pct/score; lower is better for rank. */
export function chanceFor(value: number, closing: number, unit: CutoffUnit): Chance {
  if (unit === "pct") return value >= closing + 0.3 ? "safe" : value >= closing - 0.4 ? "likely" : "reach";
  if (unit === "score") return value >= closing + 15 ? "safe" : value >= closing - 10 ? "likely" : "reach";
  return value <= closing * 0.8 ? "safe" : value <= closing * 1.25 ? "likely" : "reach";
}

/** Sample JEE Main marks→percentile curve: [marks, percentile], descending. */
const JEE_CURVE: [number, number][] = [
  [300, 100], [250, 99.99], [200, 99.6], [180, 99.2], [150, 98.4], [120, 96.6],
  [100, 94.2], [80, 89], [60, 79], [40, 58], [20, 25], [0, 0],
];
export const JEE_CANDIDATES = 1_400_000;

export function jeeMainEstimate(marks: number) {
  const m = Math.max(0, Math.min(300, marks));
  let pct = 0;
  for (let i = 0; i < JEE_CURVE.length - 1; i++) {
    const [m1, p1] = JEE_CURVE[i]!;
    const [m2, p2] = JEE_CURVE[i + 1]!;
    if (m <= m1 && m >= m2) { pct = p2 + ((p1 - p2) * (m - m2)) / (m1 - m2); break; }
  }
  return { percentile: pct, rank: Math.max(1, Math.round(((100 - pct) / 100) * JEE_CANDIDATES)) };
}
