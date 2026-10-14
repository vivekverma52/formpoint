import Link from "next/link";
import type { ReactNode } from "react";
import { Badge, IconTile, Icon, LiveBadge, type IconName } from "@/components/ui";
import { DaysLeft } from "@/components/ui/DaysLeft";
import { collegesHref } from "@/lib/filters";
import { count, dateShort, daysUntil } from "@/lib/format";
import type { College, Course, CourseKey, Deadline, Exam, NewsItem, Scholarship, Stream, Tone } from "@/lib/types";
import s from "./HomeCards.module.css";

/** Stream → signal colour. Single source so tiles, plans and badges agree. */
export const STREAM_TONE: Record<Stream, Tone> = {
  Engineering: "blue", Management: "green", Medical: "red", Law: "amber", Commerce: "blue",
};
const STREAM_ICON: Record<Stream, IconName> = {
  Engineering: "engineering", Management: "management", Medical: "medical", Law: "law", Commerce: "commerce",
};

export function StudyPlanCard({ stream, label, courses, collegeCount }: { stream: Stream; label: string; courses: CourseKey[]; collegeCount: number }) {
  const tone = STREAM_TONE[stream];
  return (
    <div className={s.plan} data-tone={tone}>
      <Link href={collegesHref({ stream })} className={s.planMain}>
        <IconTile tone={tone}><Icon name={STREAM_ICON[stream]} /></IconTile>
        <span><h3>{label}</h3><span className="num mute">{count(collegeCount)} colleges</span></span>
      </Link>
      <div className={s.planCourses}>
        {courses.map((k) => <Link key={k} href={collegesHref({ course: k })}>{k}<Icon name="arrowRight" /></Link>)}
      </div>
    </div>
  );
}

export function CourseTile({ course: c }: { course: Course }) {
  return (
    <Link href={collegesHref({ course: c.key })} className={s.tile} data-tone={STREAM_TONE[c.stream]}>
      <div>
        <span className={s.stream}>{c.stream}</span>
        <h3>{c.key}</h3>
        <p className="mute">{c.fullName}</p>
      </div>
      <dl className={s.tileMeta}>
        <div><dt>Colleges</dt><dd>{count(c.collegeCount)}</dd></div>
        <div><dt>Duration</dt><dd>{c.duration}</dd></div>
      </dl>
    </Link>
  );
}

export function DeadlineCard({ deadline: d, urgentWithinDays = 45 }: { deadline: Deadline; urgentWithinDays?: number }) {
  const days = daysUntil(d.date);
  const hot = days <= urgentWithinDays;
  return (
    <Link href={`/predictor?exam=${encodeURIComponent(d.exam)}`} className={s.deadline} data-hot={hot || undefined}>
      <span className={s.countdown}><span className="num"><DaysLeft date={d.date} serverDays={days} /></span><small>days left</small></span>
      <h3>{d.title}</h3>
      <p>{d.by} · <time dateTime={d.date}>{dateShort(d.date)}</time></p>
    </Link>
  );
}

export function ExamCard({ exam: e }: { exam: Exam }) {
  const d = new Date(`${e.date}T00:00:00+05:30`);
  const days = daysUntil(e.date);
  const soon = days <= 60;
  return (
    <Link href={`/predictor?exam=${encodeURIComponent(e.key)}`} className={s.exam}>
      <time dateTime={e.date} className={s.examDate} data-soon={soon || undefined}>
        <b className="num">{String(d.getDate()).padStart(2, "0")}</b>
        <span>{d.toLocaleString("en-IN", { month: "short", timeZone: "Asia/Kolkata" })}</span>
      </time>
      <span className={s.examText}>
        <h3>{e.fullName}</h3>
        <p>{e.conductedBy} · <span className={soon ? "tone-red" : undefined}>in <DaysLeft date={e.date} serverDays={days} /> days</span></p>
        <p>View colleges & cutoffs</p>
      </span>
      <Icon name="arrowRight" className={s.arrow} />
    </Link>
  );
}

export function ScholarshipCard({ item }: { item: Scholarship }) {
  return (
    <div className={s.schol}>
      <span className={s.amount}><span className="num">{item.amount}</span><small> {item.per}</small></span>
      <h3>{item.name}</h3>
      <span className="eyebrow">{item.by}</span>
      <p>{item.eligibility}</p>
    </div>
  );
}

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link href={`/news/${item.slug}`} className={s.news}>
      <span className={s.newsTop}><span className="eyebrow">{item.category} · {dateShort(item.date).replace(/ \d{4}$/, "")}</span>{item.live && <LiveBadge />}</span>
      <b>{item.title}</b>
    </Link>
  );
}

export function ToolCard({ href, title, description, icon, tone }: { href: string; title: string; description: string; icon: IconName; tone: Tone }) {
  return (
    <Link href={href} className={s.tool} data-tone={tone}>
      <IconTile tone={tone}><Icon name={icon} /></IconTile>
      <span><h3>{title}</h3><p>{description}</p></span>
      <span className={s.toolGo}>Open <Icon name="arrowRight" /></span>
    </Link>
  );
}

export function UniversityCard({ college: c, monogram }: { college: College; monogram: ReactNode }) {
  return (
    <div className={s.uni}>
      <Link href={`/college/${c.slug}`} className={s.uniTop}>
        {monogram}
        <h3>{c.fullName}</h3>
        <span className="mute">{c.city}, {c.state}</span>
        <Badge tone="blue">NIRF #{c.nirf} · {c.stream}</Badge>
      </Link>
      <div className={s.uniBot}>
        <Link href={`/college/${c.slug}#courses`}><Icon name="cap" /> Courses</Link>
        <Link href={`/college/${c.slug}#cutoff`}><Icon name="chart" /> Cutoffs</Link>
      </div>
    </div>
  );
}
