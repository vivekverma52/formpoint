import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { cx } from "@/lib/cx";
import s from "./Field.module.css";

interface FieldShell {
  label: string;
  hint?: ReactNode;
  error?: string;
  /** Visually hide the label (it stays available to screen readers). */
  hideLabel?: boolean;
  className?: string;
}

function Shell({ id, label, hint, error, hideLabel, className, children }: FieldShell & { id: string; children: ReactNode }) {
  return (
    <div className={cx(s.field, className)}>
      <label htmlFor={id} className={cx(s.label, hideLabel && "sr-only")}>{label}</label>
      {children}
      {error ? <p id={`${id}-err`} className={s.error} role="alert">{error}</p> : hint ? <p id={`${id}-hint`} className={s.hint}>{hint}</p> : null}
    </div>
  );
}

export type InputProps = FieldShell & Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

/** Labelled input with hint/error wiring (aria-describedby, aria-invalid). */
export function Input({ label, hint, error, hideLabel, className, id, ...rest }: InputProps) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Shell id={fid} label={label} hint={hint} error={error} hideLabel={hideLabel} className={className}>
      <input id={fid} className={s.control} aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fid}-err` : hint ? `${fid}-hint` : undefined} {...rest} />
    </Shell>
  );
}

export type SelectProps = FieldShell & Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> & {
  options: readonly (string | { value: string; label: string })[];
};

export function Select({ label, hint, error, hideLabel, className, id, options, ...rest }: SelectProps) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Shell id={fid} label={label} hint={hint} error={error} hideLabel={hideLabel} className={className}>
      <select id={fid} className={s.control} aria-invalid={error ? true : undefined} {...rest}>
        {options.map((o) => {
          const v = typeof o === "string" ? { value: o, label: o } : o;
          return <option key={v.value} value={v.value}>{v.label}</option>;
        })}
      </select>
    </Shell>
  );
}
