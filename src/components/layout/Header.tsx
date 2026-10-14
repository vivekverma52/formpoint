import Link from "next/link";
import { ThemeToggle } from "@/components/ui";
import { ApplyButton } from "@/components/shortlist/Apply";
import { ShortlistCount } from "@/components/shortlist/ShortlistControls";
import { getCollegeIndex } from "@/lib/api";
import { COURSES } from "@/lib/data/sample";
import { collegesHref } from "@/lib/filters";
import { MegaMenu } from "./MegaMenu";
import { SearchBox } from "./SearchBox";
import s from "./Header.module.css";

export function Logo() {
  return (
    <Link href="/" className={s.logo} aria-label="FormPoint home">
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
        <rect x="3" y="3" width="7" height="7" className={s.lineSq} />
        <rect x="14" y="3" width="7" height="7" className={s.blueSq} />
        <rect x="3" y="14" width="7" height="7" className={s.solidSq} />
        <rect x="14" y="14" width="7" height="7" className={s.lineSq} />
      </svg>
      Form<span>Point</span>
    </Link>
  );
}

export async function Header() {
  const index = await getCollegeIndex();
  return (
    <>
      <div className={s.strip}>
        <div className={s.stripInner}>
          <span>Admissions 2027 are open. Apply to several colleges with one form and track every application in one place.</span>
          <ApplyButton variant="ghost" size="sm" className={s.stripCta}>Talk to an advisor free</ApplyButton>
        </div>
      </div>
      <header className={s.header}>
        <div className={s.row}>
          <Logo />
          <div className={s.search}><SearchBox index={index} /></div>
          <span className={s.spacer} />
          <Link href="/colleges" className={s.mSearch} aria-label="Search colleges"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg></Link>
          <MegaMenu />
          <ShortlistCount />
          <ThemeToggle />
        </div>
        <nav className={s.quick} aria-label="Popular">
          {COURSES.slice(0, 7).map((c) => <Link key={c.key} href={collegesHref({ course: c.key })}>{c.key}</Link>)}
          <span className={s.sep} aria-hidden />
          <Link href="/rankings">Rankings</Link>
          <Link href="/predictor">Predictor</Link>
          <Link href="/compare">Compare</Link>
          <Link href="/shortlist">Applications</Link>
        </nav>
      </header>
    </>
  );
}
