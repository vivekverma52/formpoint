import type { Metadata } from "next";
import { Breadcrumbs, Container, PageHeader } from "@/components/ui";
import { ShortlistView } from "@/components/tools/ShortlistView";
import { getAllColleges } from "@/lib/api";

export const metadata: Metadata = {
  title: "My shortlist & applications",
  robots: { index: false, follow: false },
};

export default async function ShortlistPage() {
  const items = await getAllColleges();
  return (
    <Container>
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "My shortlist" }]} />
      <PageHeader eyebrow="Saved on this device" title="My shortlist & applications" description="Save colleges as you browse, then apply to all of them with one form. Track every application here." />
      <ShortlistView colleges={items} />
    </Container>
  );
}
