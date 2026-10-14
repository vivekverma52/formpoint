import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, Button, Container, Stat } from "@/components/ui";
import { ApplyButton } from "@/components/shortlist/Apply";
import { Monogram } from "@/components/college/Monogram";
import { CampusMap, CollegeHero, CourseFees, CutoffTable, DetailSection, Faq, PlacementChart, RatingBreakdown, SideBox } from "@/components/college/CollegeSections";
import { getAllCollegeSlugs, getCollege, getHome, getNearbyColleges } from "@/lib/api";
import { collegesHref } from "@/lib/filters";
import { cutoffLabel, inr, lakh, paybackLabel, paybackMonths, paybackTone, totalFee } from "@/lib/format";
import { breadcrumbJsonLd, collegeJsonLd, faqJsonLd } from "@/lib/site";
import s from "./college.module.css";

type Props = { params: Promise<{ slug: string }> };

/** ISR: pre-build known colleges, build new ones on first request, refresh hourly or via revalidateTag(`college:${slug}`). */
export const revalidate = 3600;
export async function generateStaticParams() {
  return (await getAllCollegeSlugs()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getCollege((await params).slug);
  if (!c) return {};
  const fee = c.programmes[0] ? `${lakh(c.programmes[0].feePerYear)}/yr` : "";
  return {
    title: `${c.name}: Fees ${fee}, Placements ${c.averageLpa ? `₹${c.averageLpa} LPA avg` : ""}, Cutoff 2026`,
    description: `${c.fullName}, ${c.city}: courses and fees, ${c.cutoff ? `${c.cutoff.exam} cutoff, ` : ""}placements, NIRF #${c.nirf} ranking and ratings. Apply with one form.`,
    alternates: { canonical: `/college/${c.slug}` },
    openGraph: { title: c.fullName, type: "website" },
  };
}

const TABS = [["info", "Info"], ["courses", "Courses & fees"], ["cutoff", "Cutoff"], ["placements", "Placements"], ["reviews", "Ratings"], ["faq", "Q&A"]] as const;

export default async function CollegePage({ params }: Props) {
  const c = await getCollege((await params).slug);
  if (!c) notFound();
  const [near, home] = await Promise.all([getNearbyColleges(c), getHome()]);
  const flagship = c.programmes[0]!;
  const m = paybackMonths(c);

  const faq = [
    { q: `What is the fee for ${flagship.label} at ${c.name}?`, a: `Tuition is ${inr(flagship.feePerYear)} per year, about ${lakh(totalFee(flagship))} for the full ${flagship.durationYears}-year programme. Hostel and mess are charged separately.` },
    { q: "Which exam do I need for admission?", a: c.cutoff ? `${c.cutoff.exam}. The general-category closing value last year was ${cutoffLabel(c.cutoff.close, c.cutoff.unit)}.` : "The institute runs its own entrance test, with Class 12 merit considered." },
    { q: "What is the average package?", a: c.averageLpa ? `₹${c.averageLpa} LPA for the 2026 batch, with a highest offer of ₹${c.highestLpa} LPA.` : "Campus placement figures are not reported for this institution." },
    { q: `Is ${c.name} government or private?`, a: `${c.name} is a ${c.ownership.toLowerCase()} institution, established in ${c.established}.` },
  ];
  const crumbs = [{ name: "Home", href: "/" }, { name: `${c.stream} colleges`, href: collegesHref({ stream: c.stream }) }, { name: c.name, href: `/college/${c.slug}` }];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([collegeJsonLd(c), breadcrumbJsonLd(crumbs), faqJsonLd(faq)]) }} />
      <Container>
        <Breadcrumbs items={crumbs.map((x, i) => (i === crumbs.length - 1 ? { name: x.name } : x))} />
        <CollegeHero college={c} />
      </Container>

      <nav className={s.tabs} aria-label="On this page">
        <Container className={s.tabsIn}>{TABS.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</Container>
      </nav>

      <Container className={s.grid}>
        <div className={s.main}>
          <DetailSection id="info" title={`About ${c.name}`} icon="info">
            <div className={s.stats}>
              <Stat label="Highest package" value={c.highestLpa ? `${c.highestLpa} LPA` : "—"} hint="Domestic + international" tone="green" />
              <Stat label="Average package" value={c.averageLpa ? `${c.averageLpa} LPA` : "—"} hint="2026 batch" tone="blue" />
              <Stat label="Fees from" value={lakh(Math.min(...c.programmes.map((p) => p.feePerYear)))} hint="Per year, tuition" />
              <Stat label="Fees back in" value={paybackLabel(m)} hint="Of average salary" tone={paybackTone(m)} />
            </div>
            <div className={s.about}>
              <p>{c.fullName} is a {c.ownership.toLowerCase()} institution in {c.city}, {c.state}, established in {c.established}. It is ranked #{c.nirf} in the NIRF {c.stream.toLowerCase()} category and offers {c.programmes.length} programmes.</p>
              {c.averageLpa && <p>The latest placement season reported an average package of ₹{c.averageLpa} LPA, so the full {flagship.label} fee equals about {paybackLabel(m)} of that salary.</p>}
            </div>
          </DetailSection>

          <DetailSection id="courses" title="Courses and fees" icon="cap" action={<Button size="sm" href={collegesHref({ course: flagship.course })} iconRight="arrowRight">Similar colleges</Button>}>
            <CourseFees college={c} />
          </DetailSection>

          <DetailSection id="cutoff" title="Cutoff 2026" icon="chart" tone="amber"><CutoffTable college={c} /></DetailSection>
          <DetailSection id="placements" title="Placements" icon="briefcase" tone="green"><PlacementChart college={c} /></DetailSection>
          <DetailSection id="reviews" title="Ratings" icon="award" tone="amber">
            <RatingBreakdown college={c} />
            <p className={s.note}>Only verified students and alumni can review. Each review is checked against an enrolment document before it is published.</p>
          </DetailSection>
          <DetailSection id="faq" title="Questions students ask" icon="chat"><Faq items={faq} /></DetailSection>
        </div>

        <aside className={s.side}>
          <CampusMap college={c} />
          <div className={s.cta}>
            <span className="eyebrow tone-green">Free counselling</span>
            <h3>Not sure {c.name} is the right fit?</h3>
            <p className="mute">An advisor can compare it with colleges at your rank and budget.</p>
            <ApplyButton variant="success">Talk to an advisor</ApplyButton>
          </div>
          <SideBox title="More colleges nearby">
            <ul className={s.near}>
              {near.map((x) => <li key={x.slug}><Link href={`/college/${x.slug}`}><Monogram text={x.short} size="xs" /><span>{x.name}, {x.city}</span></Link></li>)}
            </ul>
          </SideBox>
          <SideBox title="Latest updates" icon="bell">
            <ul className={s.updates}>
              {home.news.slice(0, 5).map((n) => <li key={n.slug}><Link href={`/news/${n.slug}`}><b>{n.title}</b><span className="num">{n.date}</span></Link></li>)}
            </ul>
          </SideBox>
        </aside>
      </Container>
    </>
  );
}
