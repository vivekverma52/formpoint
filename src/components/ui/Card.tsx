import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/cx";
import type { Tone } from "@/lib/types";
import s from "./Card.module.css";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "article" | "section" | "li";
  /** Tinted border + gradient wash. Use sparingly: one accent per card. */
  tone?: Tone;
  padding?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
  children: ReactNode;
}

export function Card({ as: Tag = "div", tone = "neutral", padding = "md", interactive, className, children, ...rest }: CardProps) {
  return (
    <Tag className={cx(s.card, s[`p_${padding}`], tone !== "neutral" && s.toned, tone !== "neutral" && s[tone], interactive && s.interactive, className)} {...rest}>
      {children}
    </Tag>
  );
}

/** Square tinted icon tile used in card headers. */
export function IconTile({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={cx(s.tile, s[tone])}>{children}</span>;
}
