import Link from "next/link";
import { COURSES, EXAMS, STREAMS } from "@/lib/data/sample";
import { collegesHref } from "@/lib/filters";
import { seoSlug } from "@/lib/seo-paths";
import { Logo } from "./Header";
import s from "./Footer.module.css";

/** Footer doubles as an internal-linking hub for crawlers: every link is a real, indexable URL. */
export function Footer() {
  const cols: { title: string; links: { href: string; label: string }[] }[] = [
    { title: "Top courses", links: COURSES.slice(0, 6).map((c) => ({ href: `/colleges/${seoSlug({ course: c.key })}`, label: `${c.key} colleges` })) },
    { title: "Streams", links: STREAMS.map((st) => ({ href: collegesHref({ stream: st.key }), label: st.label })) },
    { title: "Top exams", links: EXAMS.slice(0, 6).map((e) => ({ href: `/predictor?exam=${encodeURIComponent(e.key)}`, label: e.key })) },
    { title: "Tools", links: [
      { href: "/predictor", label: "College predictor" },
      { href: "/predictor?mode=rank", label: "Rank predictor" },
      { href: "/rankings", label: "Rankings" },
      { href: "/compare", label: "Compare colleges" },
      { href: "/shortlist", label: "My applications" },
    ] },
  ];
  return (
    <footer className={s.footer}>
      <div className={s.grid}>
        <div className={s.brand}>
          <Logo />
          <p>Find, compare and apply to colleges across India. Rankings from four agencies, fee payback on every college, and sponsored listings always labelled.</p>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className={s.h}>{c.title}</h2>
            <ul>{c.links.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
          </nav>
        ))}
      </div>
      <div className={s.bottom}>
        <span>© {new Date().getFullYear()} FormPoint. Preview build — figures shown are sample data.</span>
        <span className={s.status}><i aria-hidden /> All services normal</span>
      </div>
    </footer>
  );
}
