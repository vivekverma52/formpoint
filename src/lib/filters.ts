/**
 * Typed, validated listing filters.
 * URL search params are untrusted input: every value is parsed against an allow-list,
 * so a crafted URL can't produce an invalid query or an unbounded page of thin content.
 */
import { CITIES, COURSES, STREAMS } from "./data/sample";
import type { CollegeFilters, CourseKey, FeeBand, Ownership, SortKey, Stream } from "./types";

export type RawParams = Record<string, string | string[] | undefined>;

export const FEE_BANDS: { id: FeeBand; label: string; test: (fee: number) => boolean }[] = [
  { id: "lt1", label: "Under ₹1L", test: (v) => v < 1e5 },
  { id: "1-2", label: "₹1L – 2L", test: (v) => v >= 1e5 && v < 2e5 },
  { id: "2-3", label: "₹2L – 3L", test: (v) => v >= 2e5 && v < 3e5 },
  { id: "3-5", label: "₹3L – 5L", test: (v) => v >= 3e5 && v < 5e5 },
  { id: "5p", label: "₹5L and above", test: (v) => v >= 5e5 },
];
export const PACKAGE_STEPS = [30, 20, 10] as const;
export const RATING_STEPS = [4.5, 4, 3.5] as const;
export const SORTS: { id: SortKey; label: string }[] = [
  { id: "rank", label: "NIRF rank" },
  { id: "roi", label: "Fastest fee payback" },
  { id: "rating", label: "Rating" },
  { id: "package", label: "Average package" },
  { id: "fee", label: "Annual fee, low to high" },
];

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
const oneOf = <T extends string>(v: string | undefined, allowed: readonly T[]) =>
  v && (allowed as readonly string[]).includes(v) ? (v as T) : undefined;
const num = (v: string | undefined, allowed: readonly number[]) => {
  const n = v ? Number(v) : NaN;
  return allowed.includes(n) ? n : undefined;
};

export function parseFilters(params: RawParams): CollegeFilters {
  const page = Math.min(50, Math.max(1, Number(one(params.page)) || 1));
  return {
    course: oneOf<CourseKey>(one(params.course), COURSES.map((c) => c.key)),
    stream: oneOf<Stream>(one(params.stream), STREAMS.map((s) => s.key)),
    city: oneOf(one(params.city), CITIES.map((c) => c.name)),
    state: one(params.state)?.slice(0, 40),
    ownership: oneOf<Ownership>(one(params.ownership), ["Government", "Private"]),
    fee: oneOf<FeeBand>(one(params.fee), FEE_BANDS.map((b) => b.id)),
    minPackage: num(one(params.minPackage), PACKAGE_STEPS),
    minRating: num(one(params.minRating), RATING_STEPS),
    q: one(params.q)?.slice(0, 80),
    sort: oneOf<SortKey>(one(params.sort), SORTS.map((s) => s.id)) ?? "rank",
    page,
  };
}

/** Serialises filters to a stable query string (defaults omitted) for links and router.replace. */
export function toQuery(f: Partial<CollegeFilters>): string {
  const sp = new URLSearchParams();
  const entries: [string, unknown][] = [
    ["course", f.course], ["stream", f.stream], ["city", f.city], ["state", f.state],
    ["ownership", f.ownership], ["fee", f.fee], ["minPackage", f.minPackage],
    ["minRating", f.minRating], ["q", f.q],
    ["sort", f.sort && f.sort !== "rank" ? f.sort : undefined],
    ["page", f.page && f.page > 1 ? f.page : undefined],
  ];
  for (const [k, v] of entries) if (v !== undefined && v !== "") sp.set(k, String(v));
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export function collegesHref(f: Partial<CollegeFilters> = {}) {
  return `/colleges${toQuery(f)}`;
}
