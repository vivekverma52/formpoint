/**
 * Programmatic SEO paths: /colleges/btech-colleges-in-chennai, /colleges/mba-colleges.
 * Each slug maps to a filter set. Only combinations with enough results are
 * pre-rendered and listed in the sitemap — thin pages are never indexed.
 */
import { CITIES, COLLEGES, COURSES } from "./data/sample";
import type { CollegeFilters } from "./types";

export const MIN_RESULTS_TO_INDEX = 2; // raise to ~5 with real data

export function seoSlug(f: Pick<CollegeFilters, "course" | "city">): string | null {
  const course = COURSES.find((c) => c.key === f.course);
  if (!course) return null;
  const city = f.city ? CITIES.find((c) => c.name === f.city) : undefined;
  if (f.city && !city) return null;
  return city ? `${course.slug}-colleges-in-${city.slug}` : `${course.slug}-colleges`;
}

export function parseSeoSlug(slug: string): Pick<CollegeFilters, "course" | "city"> | null {
  const m = /^([a-z-]+?)-colleges(?:-in-([a-z-]+))?$/.exec(slug);
  if (!m) return null;
  const course = COURSES.find((c) => c.slug === m[1]);
  if (!course) return null;
  if (!m[2]) return { course: course.key };
  const city = CITIES.find((c) => c.slug === m[2]);
  return city ? { course: course.key, city: city.name } : null;
}

export function allSeoCombos(): Pick<CollegeFilters, "course" | "city">[] {
  return COURSES.flatMap((c) => [{ course: c.key }, ...CITIES.map((city) => ({ course: c.key, city: city.name }))]);
}

/**
 * Synchronous indexability check, safe for middleware (no I/O).
 * Production: replace with a slug set built nightly from the search index
 * (e.g. an Edge Config / JSON in S3), since middleware must stay fast.
 */
export function isIndexableSlug(slug: string): boolean {
  const f = parseSeoSlug(slug);
  if (!f) return false;
  const n = COLLEGES.filter((c) => c.programmes.some((p) => p.course === f.course) && (!f.city || c.city === f.city)).length;
  return n >= MIN_RESULTS_TO_INDEX;
}
