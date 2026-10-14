import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Icon } from "./Icon";
import s from "./Chip.module.css";

interface ChipBase {
  /** Active colour when pressed: "blue" for filters, "paper" (default) for tabs. */
  activeTone?: "paper" | "blue";
  children: ReactNode;
  className?: string;
}

export type ChipProps = ChipBase & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  /** Toggle state. Omit for a plain chip. */
  pressed?: boolean;
  /** Renders a trailing ✕ and labels the chip as removable. */
  removable?: boolean;
};

/** Toggleable filter / tab chip. Uses aria-pressed so screen readers announce state. */
export function Chip({ pressed, removable, activeTone = "paper", className, children, type = "button", ...rest }: ChipProps) {
  return (
    <button type={type} aria-pressed={pressed} className={cx(s.chip, s[activeTone], removable && s.removable, className)} {...rest}>
      {children}
      {removable && <Icon name="close" size={14} />}
    </button>
  );
}

/** Same look, but navigates — use for links that only look like chips (SEO-crawlable). */
export function ChipLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return <Link href={href} className={cx(s.chip, className)}>{children}</Link>;
}
