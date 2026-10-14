import { cx } from "@/lib/cx";
import s from "./Monogram.module.css";

/**
 * Placeholder logo built from the short name. Swap for <Image src={logoUrl}/> when
 * logos are licensed; keep the same box so layout doesn't shift.
 */
export function Monogram({ text, size = "md" }: { text: string; size?: "xs" | "md" | "xl" }) {
  return <span className={cx(s.mono, s[size])} aria-hidden>{text.slice(0, 6)}</span>;
}
