"use client";
import Link from "next/link";
import { Button, Chip, IconButton, useToast } from "@/components/ui";
import { MAX_COMPARE, toggleCompare, toggleShortlist, useCompare, useShortlist } from "./stores";
import s from "./ShortlistControls.module.css";

interface Target { slug: string; name: string }

/** Heart toggle. `withLabel` renders "Save / Saved" text for prominent placements. */
export function SaveButton({ slug, name, withLabel, size = "sm" }: Target & { withLabel?: boolean; size?: "sm" | "md" }) {
  const list = useShortlist();
  const toast = useToast();
  const on = list.includes(slug);
  const onClick = () => {
    const added = toggleShortlist(slug);
    toast.show(added ? `${name} saved to your shortlist.` : `Removed ${name} from your shortlist.`, added ? "red" : "neutral");
  };
  if (withLabel) {
    return (
      <Button size={size} variant="outline" iconLeft="heart" aria-pressed={on} onClick={onClick} className={s.save}>
        {on ? "Saved" : "Save"}
      </Button>
    );
  }
  return <IconButton icon="heart" size={size} label={on ? `Remove ${name} from shortlist` : `Save ${name}`} aria-pressed={on} onClick={onClick} className={s.save} />;
}

export function CompareButton({ slug, name, size = "sm" }: Target & { size?: "sm" | "md" }) {
  const list = useCompare();
  const toast = useToast();
  const on = list.includes(slug);
  return (
    <Button size={size} iconLeft="compare" aria-pressed={on}
      onClick={() => { if (toggleCompare(slug) === "full") toast.show(`You can compare up to ${MAX_COMPARE} colleges. Remove one first.`); }}
      aria-label={on ? `Remove ${name} from compare` : `Add ${name} to compare`}>
      Compare
    </Button>
  );
}

/** Sticky bottom tray; hidden when empty or on the compare page itself. */
export function CompareTray({ names }: { names: Record<string, string> }) {
  const list = useCompare();
  if (!list.length) return null;
  return (
    <div className={s.tray} role="region" aria-label="Colleges selected for comparison">
      <div className={s.inner}>
        <span className="eyebrow num">{list.length}/{MAX_COMPARE}</span>
        <div className={s.names}>
          {list.map((slug) => (
            <Chip key={slug} removable onClick={() => toggleCompare(slug)} aria-label={`Remove ${names[slug] ?? slug}`}>{names[slug] ?? slug}</Chip>
          ))}
        </div>
        <Link href="/compare" className={s.go}>Compare now</Link>
      </div>
    </div>
  );
}

export function ShortlistCount() {
  const n = useShortlist().length;
  return (
    <Link href="/shortlist" className={s.count} aria-label={`My shortlist and applications${n ? `, ${n} saved` : ""}`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
      </svg>
      {n > 0 && <span className={s.badge}>{n}</span>}
    </Link>
  );
}
