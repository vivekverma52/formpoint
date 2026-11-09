"use client";
import { useEffect, useState, type CSSProperties } from "react";
import s from "./Intro.module.css";

/** Runs in <head> before first paint: skips the intro for reduced-motion users, so the overlay never flashes. */
export const introInitScript = `(function(){try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("no-intro")}catch(e){}})()`;

/**
 * Logo intro shown on every full page load: the P, blue bar and point fly in spinning and snap together,
 * then the mark slides left and "FormPoint." is typed out with a blinking caret, and the overlay fades to the page.
 * Pure CSS animation; this component only removes the overlay when it finishes.
 */
const typedName = (
  <>
    {[..."FormPoint"].map((ch, i) => <span key={i} className={s.letter} style={{ "--i": i } as CSSProperties}>{ch}</span>)}
    <i className={`${s.letter} ${s.dot}`} style={{ "--i": 9 } as CSSProperties} />
    <span className={s.caret} />
  </>
);

export function Intro() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("no-intro")) { setDone(true); return; }
    const t = window.setTimeout(() => setDone(true), 7400);
    return () => window.clearTimeout(t);
  }, []);

  if (done) return null;
  return (
    <div className={s.intro} aria-hidden onClick={() => setDone(true)}>
      <div className={s.lockup}>
        <svg viewBox="0 0 32 32" className={s.mark}>
          <path
            className={s.p}
            fillRule="evenodd"
            d="M6.5 3H17a8.5 8.5 0 0 1 0 17h-6v7a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm4.5 6v5.5h5.5a2.75 2.75 0 0 0 0-5.5Z"
          />
          <rect x="9" y="9.75" width="7" height="4" rx="2" className={s.bar} />
          <circle cx="24.5" cy="26" r="3.5" className={s.point} />
        </svg>
        <span className={s.word} aria-label="FormPoint">
          <span className={s.wordIn}>
            {/* Invisible copy built from the same pieces reserves the exact final width (letters, dot and caret),
                so the mark doesn't drift while typing and nothing gets clipped at the end. */}
            <span className={s.ghost}>{typedName}</span>
            <span className={s.typed}>{typedName}</span>
          </span>
        </span>
      </div>
    </div>
  );
}
