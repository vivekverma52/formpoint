import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/cx";
import type { Tone } from "@/lib/types";
import { Icon } from "./Icon";
import s from "./Layout.module.css";

/** Max-width page column. Side gutters are applied once on <body>. */
export function Container({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(s.container, className)} {...rest}>{children}</div>;
}

export interface SectionProps {
  id?: string;
  eyebrow?: string;
  eyebrowTone?: Tone;
  title: string;
  /** Heading level — keep one <h1> per page; sections default to <h2>. */
  as?: "h1" | "h2";
  action?: ReactNode;
  children: ReactNode;
  divider?: boolean;
  className?: string;
}

/** Page section with an eyebrow, title and optional right-side action. */
export function Section({ id, eyebrow, eyebrowTone, title, as: H = "h2", action, children, divider = true, className }: SectionProps) {
  return (
    <section id={id} className={cx(s.section, divider && s.divider, className)} aria-labelledby={id ? `${id}-title` : undefined}>
      <Container>
        <div className={s.head}>
          <div>
            {eyebrow && <div className={cx("eyebrow", eyebrowTone && eyebrowTone !== "neutral" && `tone-${eyebrowTone}`)}>{eyebrow}</div>}
            <H id={id ? `${id}-title` : undefined} className={s.title}>{title}</H>
          </div>
          {action && <div className={s.action}>{action}</div>}
        </div>
        {children}
      </Container>
    </section>
  );
}

export interface Crumb { name: string; href?: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className={s.crumbs}>
      <ol>
        {items.map((c, i) => (
          <li key={c.name}>
            {c.href && i < items.length - 1 ? <Link href={c.href}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description?: ReactNode; children?: ReactNode }) {
  return (
    <header className={s.pageHead}>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      {children}
    </header>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: ReactNode; action?: ReactNode }) {
  return (
    <div className={s.empty}>
      <Icon name="info" size={20} />
      <strong>{title}</strong>
      {description && <span>{description}</span>}
      {action}
    </div>
  );
}

export function Skeleton({ height = 16, width = "100%", radius = 8 }: { height?: number; width?: number | string; radius?: number }) {
  return <span className={s.skeleton} style={{ height, width, borderRadius: radius }} aria-hidden />;
}

export interface StatProps { label: string; value: ReactNode; hint?: string; tone?: Tone }

/** Tinted KPI tile. Colour encodes judgement (green = good), the label says what it is. */
export function Stat({ label, value, hint, tone = "neutral" }: StatProps) {
  return (
    <div className={cx(s.stat, s[tone])}>
      <span className="eyebrow">{label}</span>
      <b className="num">{value}</b>
      {hint && <small>{hint}</small>}
    </div>
  );
}
