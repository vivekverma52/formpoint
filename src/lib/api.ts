/**
 * Data access layer. Every page and component reads data through these functions only.
 *
 * Today they read the in-repo sample. To go live, replace each body with a call to the
 * NestJS API via `apiFetch`, keeping the signatures — callers don't change.
 * Cache tags let the CMS/API trigger `revalidateTag("college:iit-bombay")` on edits.
 */
import "server-only";
import { cache } from "react";
import { COLLEGES, COURSES, DEADLINES, EXAMS, NEWS, SCHOLARSHIPS } from "./data/sample";
import { FEE_BANDS } from "./filters";
import { paybackMonths, programmeFor } from "./format";
import type { College, CollegeFilters, Paged } from "./types";

export const PAGE_SIZE = 20;

/** Real-API helper. Typed, tagged, time-boxed. */
export async function apiFetch<T>(path: string, init: { tags?: string[]; revalidate?: number } = {}): Promise<T> {
  const base = process.env.FORMPOINT_API_URL;
  if (!base) throw new Error("FORMPOINT_API_URL is not set");
  const res = await fetch(`${base}${path}`, {
    next: { tags: init.tags, revalidate: init.revalidate ?? 3600 },
    signal: AbortSignal.timeout(8000),
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error(`API ${res.status} on ${path}`);
  return (await res.json()) as T;
}

const offers = (c: College, course?: string) => !course || c.programmes.some((p) => p.course === course);
const streamsOf = (c: College) =>
  new Set(c.programmes.map((p) => COURSES.find((k) => k.key === p.course)?.stream ?? c.stream));

export const searchColleges = cache(async (f: CollegeFilters): Promise<Paged<College>> => {
  // Live: return apiFetch(`/colleges/search${toQuery(f)}`, { tags: ["colleges"] }) — backed by Typesense.
  const q = f.q?.toLowerCase();
  const band = FEE_BANDS.find((b) => b.id === f.fee);
  const list = COLLEGES.filter(
    (c) =>
      offers(c, f.course) &&
      (!f.stream || streamsOf(c).has(f.stream)) &&
      (!f.city || c.city === f.city) &&
      (!f.state || c.state === f.state) &&
      (!f.ownership || c.ownership === f.ownership) &&
      (!band || band.test(programmeFor(c, f.course).feePerYear)) &&
      (!f.minPackage || (c.averageLpa ?? 0) >= f.minPackage) &&
      (!f.minRating || c.rating >= f.minRating) &&
      (!q || [c.name, c.fullName, c.short, c.city, c.state, ...c.programmes.map((p) => p.course)].join(" ").toLowerCase().includes(q)),
  );
  const sorters: Record<CollegeFilters["sort"], (a: College, b: College) => number> = {
    rank: (a, b) => a.nirf - b.nirf,
    rating: (a, b) => b.rating - a.rating,
    package: (a, b) => (b.averageLpa ?? 0) - (a.averageLpa ?? 0),
    fee: (a, b) => programmeFor(a, f.course).feePerYear - programmeFor(b, f.course).feePerYear,
    roi: (a, b) => (paybackMonths(a, f.course) ?? 999) - (paybackMonths(b, f.course) ?? 999),
  };
  list.sort(sorters[f.sort]);
  const start = (f.page - 1) * PAGE_SIZE;
  return { items: list.slice(start, start + PAGE_SIZE), total: list.length, page: f.page, pageSize: PAGE_SIZE };
});

export const getCollege = cache(async (slug: string): Promise<College | null> => {
  // Live: return apiFetch(`/colleges/${slug}`, { tags: [`college:${slug}`] });
  return COLLEGES.find((c) => c.slug === slug) ?? null;
});

/** Full records for client tools (compare, shortlist, predictor). Live: replace with a by-slugs endpoint. */
export const getAllColleges = cache(async (): Promise<College[]> => COLLEGES);

export const getAllCollegeSlugs = cache(async () => COLLEGES.map((c) => ({ slug: c.slug, updatedAt: c.updatedAt })));

export const getTopColleges = cache(async (course: string, limit = 8) =>
  COLLEGES.filter((c) => offers(c, course)).sort((a, b) => a.nirf - b.nirf).slice(0, limit),
);

export const getNearbyColleges = cache(async (c: College, limit = 6) =>
  [...COLLEGES.filter((x) => x.slug !== c.slug && x.state === c.state), ...COLLEGES.filter((x) => x.slug !== c.slug && x.state !== c.state && x.stream === c.stream)].slice(0, limit),
);

export const getHome = cache(async () => ({
  featured: ["iit-madras", "iit-bombay", "iit-delhi", "iim-ahmedabad", "aiims-delhi", "nlsiu", "bits-pilani", "iiit-hyderabad"]
    .map((s) => COLLEGES.find((c) => c.slug === s))
    .filter((c): c is College => Boolean(c)),
  exams: [...EXAMS].sort((a, b) => a.date.localeCompare(b.date)),
  deadlines: DEADLINES,
  news: NEWS,
  scholarships: SCHOLARSHIPS,
}));

export const getExams = cache(async () => EXAMS);
export const getCollegesByExam = cache(async (exam: string) => COLLEGES.filter((c) => c.cutoff?.exam === exam));
/** Lightweight index for client-side search suggestions and the compare picker. */
export const getCollegeIndex = cache(async () =>
  COLLEGES.map(({ slug, name, fullName, short, city }) => ({ slug, name, fullName, short, city })),
);
export type CollegeIndexItem = Awaited<ReturnType<typeof getCollegeIndex>>[number];
