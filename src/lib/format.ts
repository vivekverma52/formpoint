import type { College, CourseKey, Programme, Tone } from "./types";

const inrFmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** ₹2,29,000 */
export const inr = (n: number) => `₹${inrFmt.format(Math.round(n))}`;

/** ₹2.29L for ≥1 lakh, otherwise full rupees. */
export const lakh = (n: number) => (n >= 1e5 ? `₹${parseFloat((n / 1e5).toFixed(2))}L` : inr(n));

/** ₹24 LPA, or an em dash when not reported. */
export const lpa = (v: number | null | undefined) => (v == null ? "—" : `₹${v} LPA`);

export const count = (n: number) => inrFmt.format(n);

export const dateShort = (iso: string) =>
  new Date(`${iso}T00:00:00+05:30`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

/** Whole days from now until an ISO date (IST), never negative. */
export function daysUntil(iso: string, now: number = Date.now()) {
  return Math.max(0, Math.ceil((new Date(`${iso}T00:00:00+05:30`).getTime() - now) / 864e5));
}

export function programmeFor(c: College, course?: CourseKey): Programme {
  const first = c.programmes[0];
  if (!first) throw new Error(`College ${c.slug} has no programmes`);
  return (course && c.programmes.find((p) => p.course === course)) || first;
}

export const totalFee = (p: Programme) => p.feePerYear * Math.ceil(p.durationYears);

/**
 * "Fees back in" — months of average salary needed to cover the full programme fee.
 * Null when placements are not reported (e.g. medical colleges).
 */
export function paybackMonths(c: College, course?: CourseKey): number | null {
  if (!c.averageLpa) return null;
  return totalFee(programmeFor(c, course)) / ((c.averageLpa * 1e5) / 12);
}

export function paybackLabel(m: number | null) {
  if (m == null) return "—";
  return m < 12 ? `${Math.max(1, Math.round(m))} months` : `${(m / 12).toFixed(1)} yrs`;
}

export function paybackTone(m: number | null): Tone {
  if (m == null) return "neutral";
  if (m <= 12) return "green";
  if (m <= 24) return "amber";
  return "red";
}

export function cutoffLabel(v: number, unit: "rank" | "pct" | "score") {
  if (unit === "pct") return `${v} %ile`;
  if (unit === "score") return `${v} score`;
  return count(v);
}
