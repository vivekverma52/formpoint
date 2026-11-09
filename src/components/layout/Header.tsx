import Link from "next/link";
import { ThemeToggle } from "@/components/ui";
import { ApplyButton } from "@/components/shortlist/Apply";
import { ShortlistCount } from "@/components/shortlist/ShortlistControls";
import { getCollegeIndex } from "@/lib/api";
import { CategoryNav } from "./CategoryNav";
import { MegaMenu } from "./MegaMenu";
import { SearchBox } from "./SearchBox";
import s from "./Header.module.css";

export function Logo() {
  return (
    <Link href="/" className={s.logo} aria-label="FormPoint home">
      {/* "P" mark: rounded P with a blue bar in its bowl and a blue point. */}
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden className={s.mark}>
        <path fillRule="evenodd" d="M6.5 3H17a8.5 8.5 0 0 1 0 17h-6v7a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm4.5 6v5.5h5.5a2.75 2.75 0 0 0 0-5.5Z" />
        <rect x="9" y="9.75" width="7" height="4" rx="2" className={s.blue} />
        <circle cx="24.5" cy="26" r="3.5" className={s.blue} />
      </svg>
      <span className={s.word}>FormPoint<i className={s.dot} aria-hidden /></span>
    </Link>
  );
}

export async function Header() {
  const index = await getCollegeIndex();
  return (
    <>
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
        <CategoryNav>
          <Link href="/rankings">Rankings</Link>
          <Link href="/predictor">Predictor</Link>
          <Link href="/compare">Compare</Link>
          <Link href="/shortlist">Applications</Link>
        </CategoryNav>
      </header>
    </>
  );
}
