import { cx } from "@/lib/cx";
import s from "./Stars.module.css";

const STAR = "M12 2.4l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.2 1.3-6.6-4.9-4.6 6.6-.8z";

export interface StarsProps {
  /** 0–5, fractional values render partial stars (4.3 → 30% of the fifth). */
  value: number;
  size?: "sm" | "lg";
  className?: string;
}

/**
 * Glossy gold rating stars with a sweeping glint.
 * Server component, zero JS. Requires <StarDefs/> once in the root layout.
 */
export function Stars({ value, size = "sm", className }: StarsProps) {
  const v = Math.max(0, Math.min(5, value));
  return (
    <span className={cx(s.stars, s[size], className)} role="img" aria-label={`Rated ${v} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, v - i));
        return (
          <span key={i} className={s.star}>
            <svg className={s.empty} viewBox="0 0 24 24" aria-hidden><path d={STAR} /></svg>
            {fill > 0 && (
              <span className={s.fill} style={{ width: `${Math.round(fill * 100)}%` }}>
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d={STAR} fill="url(#fp-star-gold)" className={s.edge} />
                  <path d={STAR} fill="url(#fp-star-glint)" />
                </svg>
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

/** Shared SVG gradients for <Stars/>. Render once, near the top of <body>. */
export function StarDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden focusable="false">
      <defs>
        <linearGradient id="fp-star-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD24D" />
          <stop offset=".5" stopColor="#FFA41C" />
          <stop offset="1" stopColor="#E07A10" />
        </linearGradient>
        <linearGradient id="fp-star-glint" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".42" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".9" />
          <stop offset=".58" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
          <animateTransform attributeName="gradientTransform" type="translate" values="-1 -1;1 1;1 1" keyTimes="0;.45;1" dur="3.6s" repeatCount="indefinite" />
        </linearGradient>
      </defs>
    </svg>
  );
}
