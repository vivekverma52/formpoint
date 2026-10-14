import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Icon, type IconName } from "./Icon";
import s from "./Button.module.css";

export type ButtonVariant = "primary" | "success" | "solid" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface Common {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: IconName;
  iconRight?: IconName;
  /** Shows a spinner, disables the button and sets aria-busy. */
  loading?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
  className?: string;
}

type AsButton = Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Common> & { href?: undefined };
type AsLink = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Common> & { href: string; prefetch?: boolean };
export type ButtonProps = AsButton | AsLink;

/**
 * One button for every action. Renders a Next <Link> when `href` is set, otherwise a <button>.
 * Semantics follow the signal system: primary = blue (act), success = green, danger = red.
 */
export function Button(props: ButtonProps) {
  const { variant = "outline", size = "md", iconLeft, iconRight, loading, fullWidth, children, className, ...rest } = props;
  const cls = cx(s.btn, s[variant], s[size], fullWidth && s.full, loading && s.loading, className);
  const iconSize = size === "lg" ? 18 : 16;
  const content = (
    <>
      {loading ? <span className={s.spinner} aria-hidden /> : iconLeft && <Icon name={iconLeft} size={iconSize} />}
      {children}
      {iconRight && !loading && <Icon name={iconRight} size={iconSize} />}
    </>
  );

  if (typeof rest.href === "string") {
    const { href, prefetch, ...anchor } = rest as AsLink;
    const external = /^https?:\/\//.test(href);
    if (external) {
      return <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...anchor}>{content}</a>;
    }
    return <Link href={href} prefetch={prefetch} className={cls} {...anchor}>{content}</Link>;
  }

  const { type = "button", disabled, ...button } = rest as AsButton;
  return (
    <button type={type} className={cls} disabled={disabled || loading} aria-busy={loading || undefined} {...button}>
      {content}
    </button>
  );
}

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  icon: IconName;
  /** Required: icon-only buttons must have an accessible name. */
  label: string;
  variant?: ButtonVariant;
  size?: Exclude<ButtonSize, "lg">;
  badge?: number;
}

export function IconButton({ icon, label, variant = "outline", size = "md", badge, className, type = "button", ...rest }: IconButtonProps) {
  return (
    <button type={type} aria-label={label} title={label} className={cx(s.btn, s[variant], s.icon, s[`icon_${size}`], className)} {...rest}>
      <Icon name={icon} />
      {badge ? <span className={s.badge} aria-hidden>{badge > 99 ? "99+" : badge}</span> : null}
    </button>
  );
}
