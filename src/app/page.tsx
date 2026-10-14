import { Button, Container, Rail, Section } from "@/components/ui";
import { ApplyButton } from "@/components/shortlist/Apply";
import { Monogram } from "@/components/college/Monogram";
import { RankTable } from "@/components/college/RankTable";
import { SearchBox } from "@/components/layout/SearchBox";
import { CourseTile, DeadlineCard, ExamCard, NewsCard, ScholarshipCard, StudyPlanCard, ToolCard, UniversityCard } from "@/components/home/HomeCards";
import { CourseTabs } from "@/components/home/CourseTabs";
import grid from "@/components/home/HomeCards.module.css";
import { getCollegeIndex, getHome, getTopColleges } from "@/lib/api";
import { COURSES, STREAMS } from "@/lib/data/sample";
import { collegesHref } from "@/lib/filters";
import s from "./home.module.css";

/** Home is ISR: rebuilt at most hourly, or on demand via revalidateTag from the CMS. */
export const revalidate = 3600;

export default async function HomePage() {
  const [home, index] = await Promise.all([getHome(), getCollegeIndex()]);
  const tabs = await Promise.all(
    COURSES.filter((c) => ["B.Tech", "MBA", "MBBS", "BA LLB", "B.Com", "BBA"].includes(c.key)).map(async (c) => ({ key: c.key, colleges: await getTopColleges(c.key) })),
  );

  return (
    <>
      <section className={s.hero}>
        <Container className={s.heroIn}>
          <div className="eyebrow">Admissions 2027 · 38,400 colleges · 520 entrance exams</div>
          <h1 className={s.h1}>Find the right college.<br /><span>Apply with one form.</span></h1>
          <SearchBox index={index} variant="hero" placeholder="Try “IIT Bombay”, “MBA in Bengaluru” or “Chennai”" />
          <div className={s.heroCtas}>
            <ApplyButton variant="success">Get free counselling</ApplyButton>
            <Button href="/predictor" iconRight="arrowRight">Check your chances</Button>
          </div>
        </Container>
        <Container className={s.ticker}>
          <Rail label="Latest admission news" itemMinWidth={260} autoplayMs={4500} showDots>
            {home.news.map((n) => <NewsCard key={n.slug} item={n} />)}
          </Rail>
        </Container>
      </section>

      <Section id="plans" eyebrow="Start with a stream" title="Browse study plans" divider={false}>
        <Rail label="Study plans by stream" itemMinWidth={290}>
          {STREAMS.map((st) => <StudyPlanCard key={st.key} stream={st.key} label={st.label} courses={st.courses} collegeCount={st.collegeCount} />)}
        </Rail>
      </Section>

      <Section id="deadlines" eyebrow="Don't miss these · sample dates" eyebrowTone="red" title="Closing soon">
        <div className={grid.grid4}>{home.deadlines.map((d) => <DeadlineCard key={d.title} deadline={d} />)}</div>
      </Section>

      <Section id="tools" eyebrow="Free tools" title="Plan your admission">
        <div className={grid.grid5}>
          <ToolCard href="/predictor" title="College predictor" description="See where your rank gets you, by category." icon="target" tone="blue" />
          <ToolCard href="/predictor?mode=rank" title="Rank predictor" description="Turn JEE Main marks into an expected rank." icon="calculator" tone="green" />
          <ToolCard href="/rankings" title="Rankings, side by side" description="Four agencies in one table, by stream and zone." icon="trophy" tone="blue" />
          <ToolCard href="/compare" title="Compare colleges" description="Fees, packages and payback for up to three." icon="compare" tone="amber" />
          <ToolCard href="/shortlist" title="One-form apply" description="Shortlist colleges and apply to all at once." icon="form" tone="red" />
        </div>
      </Section>

      <Section id="courses" eyebrow="Programmes" title="Best courses in India" action={<Button href="/colleges" iconRight="arrowRight">All colleges</Button>}>
        <div className={grid.grid5}>{COURSES.map((c) => <CourseTile key={c.key} course={c} />)}</div>
      </Section>

      <Section id="universities" eyebrow="NIRF leaders by stream" title="Top universities in India" action={<Button href="/rankings" iconRight="arrowRight">Full rankings</Button>}>
        <Rail label="Top universities" itemMinWidth={230}>
          {home.featured.map((c) => <UniversityCard key={c.slug} college={c} monogram={<Monogram text={c.short} size="xl" />} />)}
        </Rail>
      </Section>

      <Section id="top" eyebrow="Ranked by NIRF" title="Course-wise top colleges">
        <CourseTabs tabs={tabs.map((t) => ({ key: t.key, href: collegesHref({ course: t.key }), panel: <RankTable colleges={t.colleges} /> }))} />
      </Section>

      <Section id="exams" eyebrow="Calendar · dates tentative" title="Top entrance exams" action={<Button href="/predictor" iconRight="arrowRight">College predictor</Button>}>
        <div className={grid.grid4}>{home.exams.map((e) => <ExamCard key={e.key} exam={e} />)}</div>
      </Section>

      <Section id="scholarships" eyebrow="Money for college" eyebrowTone="green" title="Scholarships you can apply for">
        <div className={grid.grid4}>{home.scholarships.map((sc) => <ScholarshipCard key={sc.name} item={sc} />)}</div>
        <p className={s.note}>Amounts and eligibility as last published. Confirm the current rules on the National Scholarship Portal or AICTE before applying.</p>
      </Section>
    </>
  );
}
