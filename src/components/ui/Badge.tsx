import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/cx";
import type { Chance, Tone } from "@/lib/types";
import s from "./Badge.module.css";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  /** "tag" is the squared mono label; "pill" is the rounded uppercase status. */
  shape?: "tag" | "pill";
  children: ReactNode;
}

/** Status and metadata labels. Meaning is always carried by text too, never by colour alone. */
export function Badge({ tone = "neutral", shape = "tag", className, children, ...rest }: BadgeProps) {
  return <span className={cx(s.badge, s[shape], s[tone], className)} {...rest}>{children}</span>;
}

const CHANCE: Record<Chance, { tone: Tone; label: string }> = {
  safe: { tone: "green", label: "Safe" },
  likely: { tone: "amber", label: "Likely" },
  reach: { tone: "red", label: "Reach" },
};

export function ChanceBadge({ chance }: { chance: Chance }) {
  const c = CHANCE[chance];
  return <Badge shape="pill" tone={c.tone}>{c.label}</Badge>;
}

export function LiveBadge() {
  return <span className={s.live}>LIVE</span>;
}
