import type { College } from "./types";

export const SITE = {
  name: "FormPoint",
  tagline: "Find, compare and apply to colleges with one form.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.formpoint.in",
  locale: "en_IN",
} as const;

export const absoluteUrl = (path: string) => new URL(path, SITE.url).toString();

/** schema.org JSON-LD for a college page. Ratings are deliberately omitted:
 * Google doesn't show review stars for ratings a site publishes about
 * organisations it lists, and marking them up anyway risks a manual action. */
export function collegeJsonLd(c: College) {
  return {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: c.fullName,
    alternateName: c.short,
    foundingDate: String(c.established),
    url: absoluteUrl(`/college/${c.slug}`),
    address: { "@type": "PostalAddress", addressLocality: c.city, addressRegion: c.state, addressCountry: "IN" },
    hasCourse: c.programmes.map((p) => ({
      "@type": "Course",
      name: p.label,
      provider: { "@type": "CollegeOrUniversity", name: c.fullName },
      offers: { "@type": "Offer", price: p.feePerYear, priceCurrency: "INR", category: "Tuition per year" },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.href) })),
  };
}

export function faqJsonLd(qa: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}
