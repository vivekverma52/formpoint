import type { Metadata } from "next";
import { ListingView, listingTitle } from "@/components/college/ListingView";
import { parseFilters, type RawParams } from "@/lib/filters";

type Props = { searchParams: Promise<RawParams> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const f = parseFilters(await searchParams);
  const title = listingTitle(f);
  return {
    title,
    description: `${title}: compare fees, average packages, fee payback, cutoffs and ratings. Apply to several with one form.`,
    alternates: { canonical: "/colleges" },
    // Filter permutations are useful to people but thin to search engines: keep them out of the index.
    robots: { index: false, follow: true },
  };
}

export default async function CollegesPage({ searchParams }: Props) {
  // Plain course/city views are 308-redirected to their SEO URL in middleware.ts.
  return <ListingView filters={parseFilters(await searchParams)} />;
}
