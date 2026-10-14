import type { Metadata } from "next";
import { Breadcrumbs, Container, PageHeader } from "@/components/ui";
import { CompareView } from "@/components/tools/CompareView";
import { getAllColleges } from "@/lib/api";

export const metadata: Metadata = {
  title: "Compare colleges",
  description: "Compare up to three colleges on fees, packages, fee payback, cutoffs and ratings.",
  alternates: { canonical: "/compare" },
  robots: { index: false, follow: true },
};

export default async function ComparePage() {
  // Live: fetch only the selected slugs from an API route instead of the full list.
  const items = await getAllColleges();
  return (
    <Container>
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Compare" }]} />
      <PageHeader eyebrow="Tools" title="Compare colleges" description="Pick up to three. The strongest value in each row is marked in green." />
      <CompareView colleges={items} />
    </Container>
  );
}
