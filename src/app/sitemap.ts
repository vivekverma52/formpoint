import type { MetadataRoute } from "next";
import { getAllCollegeSlugs, searchColleges } from "@/lib/api";
import { parseFilters } from "@/lib/filters";
import { allSeoCombos, MIN_RESULTS_TO_INDEX, seoSlug } from "@/lib/seo-paths";
import { absoluteUrl } from "@/lib/site";

/**
 * At scale, split this into a sitemap index with `generateSitemaps()` —
 * one file per 50,000 URLs (colleges, SEO listings, exams, news).
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const colleges = await getAllCollegeSlugs();
  const listings: MetadataRoute.Sitemap = [];
  for (const combo of allSeoCombos()) {
    const slug = seoSlug(combo);
    if (!slug) continue;
    const { total } = await searchColleges({ ...parseFilters({}), ...combo });
    if (total >= MIN_RESULTS_TO_INDEX) listings.push({ url: absoluteUrl(`/colleges/${slug}`), changeFrequency: "weekly", priority: 0.7 });
  }
  return [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/predictor"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/rankings"), changeFrequency: "monthly", priority: 0.8 },
    ...listings,
    ...colleges.map((c) => ({ url: absoluteUrl(`/college/${c.slug}`), lastModified: c.updatedAt, changeFrequency: "weekly" as const, priority: 0.9 })),
  ];
}
