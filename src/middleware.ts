import { NextResponse, type NextRequest } from "next/server";
import { isIndexableSlug, seoSlug } from "@/lib/seo-paths";
import { COURSES, CITIES } from "@/lib/data/sample";
import type { CourseKey } from "@/lib/types";

/**
 * Canonicalises listing URLs with a real HTTP 308 before any rendering:
 *   /colleges?course=B.Tech            → /colleges/btech-colleges
 *   /colleges?course=MBA&city=Bengaluru → /colleges/mba-colleges-in-bengaluru  (only if that page is indexable)
 * Any other parameter (fee, sort, q, page…) keeps the user on /colleges, which is noindex.
 */
export function middleware(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const keys = [...searchParams.keys()];
  if (!keys.length || keys.some((k) => k !== "course" && k !== "city")) return NextResponse.next();

  const course = COURSES.find((c) => c.key === searchParams.get("course"))?.key as CourseKey | undefined;
  const city = searchParams.get("city") ?? undefined;
  if (!course || (city && !CITIES.some((c) => c.name === city))) return NextResponse.next();

  const slug = seoSlug({ course, city });
  if (!slug || !isIndexableSlug(slug)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/colleges/${slug}`;
  url.search = "";
  return NextResponse.redirect(url, 308);
}

export const config = { matcher: "/colleges" };
