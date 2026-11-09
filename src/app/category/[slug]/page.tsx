import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, ChipLink, Container, Icon, PageHeader, Section } from "@/components/ui";
import { ApplyButton } from "@/components/shortlist/Apply";
import { CATEGORIES, CATEGORY_SECTIONS, getCategory } from "@/lib/data/categories";
import s from "./category.module.css";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getCategory((await params).slug);
  return cat ? { title: `${cat.label} — counselling, colleges, courses and application forms`, description: cat.description, alternates: { canonical: `/category/${cat.slug}` } } : {};
}

export default async function CategoryPage({ params }: Props) {
  const cat = getCategory((await params).slug);
  if (!cat) notFound();
  return (
    <>
      <Container>
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: cat.label }]} />
        <PageHeader eyebrow="Category" title={cat.label} description={cat.description} />
        <nav className={s.jump} aria-label="On this page">
          {CATEGORY_SECTIONS.map((sec) => <ChipLink key={sec.id} href={`#${sec.id}`}>{sec.title}</ChipLink>)}
        </nav>
      </Container>
      {CATEGORY_SECTIONS.map((sec) => (
        <Section key={sec.id} id={sec.id} title={sec.title} className={s.section}>
          <ul className={s.grid}>
            {cat[sec.key].map((it) => (
              <li key={it.label} className={s.item}>
                <div>
                  {it.href ? <Link href={it.href} className={s.name}>{it.label}</Link> : <span className={s.name}>{it.label}</span>}
                  {it.note && <span className={s.note}>{it.note}</span>}
                </div>
                {sec.key === "forms" ? (
                  <ApplyButton size="sm" variant="outline">Get help applying</ApplyButton>
                ) : sec.key === "counselling" ? (
                  <ApplyButton size="sm" variant="outline">Talk to an advisor</ApplyButton>
                ) : it.href ? (
                  <Link href={it.href} className={s.more} aria-label={`View ${it.label}`}><Icon name="arrowRight" size={16} /></Link>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </>
  );
}
