import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingView, listingTitle } from "@/components/college/ListingView";
import { searchColleges } from "@/lib/api";
import { parseFilters } from "@/lib/filters";
import { allSeoCombos, MIN_RESULTS_TO_INDEX, parseSeoSlug, seoSlug } from "@/lib/seo-paths";
import { breadcrumbJsonLd } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 3600;
/** Unknown slugs 404 instead of rendering empty pages. */
export const dynamicParams = false;

async function resolve(slug: string) {
  const seo = parseSeoSlug(slug);
  if (!seo) return null;
  const filters = { ...parseFilters({}), ...seo };
  const { total } = await searchColleges(filters);
  return total >= MIN_RESULTS_TO_INDEX ? { seo, filters, total } : null;
}

export async function generateStaticParams() {
  const out: { slug: string }[] = [];
  for (const combo of allSeoCombos()) {
    const slug = seoSlug(combo);
    if (slug && (await resolve(slug))) out.push({ slug });
  }
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await resolve((await params).slug);
  if (!r) return {};
  const title = `${listingTitle(r.seo)} 2026`;
  return {
    title,
    description: `${r.total} ${r.seo.course} colleges${r.seo.city ? ` in ${r.seo.city}` : ""} ranked by NIRF, with fees, average packages, fee payback and cutoffs.`,
    alternates: { canonical: `/colleges/${(await params).slug}` },
  };
}

export default async function SeoListingPage({ params }: Props) {
  const { slug } = await params;
  const r = await resolve(slug);
  if (!r) notFound();
  const crumbs = breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Colleges", href: "/colleges" }, { name: listingTitle(r.seo), href: `/colleges/${slug}` }]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <ListingView filters={r.filters} seed={r.seo} />
    </>
  );
}
