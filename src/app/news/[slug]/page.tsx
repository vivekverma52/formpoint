import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge, Breadcrumbs, Button, Container, LiveBadge, PageHeader } from "@/components/ui";
import { getHome } from "@/lib/api";
import { dateShort } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 600;
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getHome()).news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const n = (await getHome()).news.find((x) => x.slug === slug);
  // Placeholder article bodies are thin content: keep them out of the index until the CMS lands.
  return n ? { title: n.title, robots: { index: false, follow: true } } : {};
}

export default async function NewsPage({ params }: Props) {
  const { slug } = await params;
  const n = (await getHome()).news.find((x) => x.slug === slug);
  if (!n) notFound();
  return (
    <Container>
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "News" }, { name: n.category }]} />
      <PageHeader eyebrow={`${n.category} · ${dateShort(n.date)}`} title={n.title} description="The full article will load here from the newsroom CMS.">
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>{n.live && <LiveBadge />}<Badge tone="amber">Preview</Badge></div>
      </PageHeader>
      <Button href="/" iconLeft="chevronLeft">Back to home</Button>
    </Container>
  );
}
