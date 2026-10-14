"use client";
import { useId, useRef, type KeyboardEvent } from "react";
import { cx } from "@/lib/cx";
import s from "./Segmented.module.css";

export interface SegmentedOption<T extends string> { value: T; label: string }

export interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  size?: "sm" | "md";
  className?: string;
}

/** Single-choice segmented control (radiogroup semantics, arrow-key navigation). */
export function Segmented<T extends string>({ options, value, onChange, label, size = "md", className }: SegmentedProps<T>) {
  const group = useRef<HTMLDivElement>(null);
  const name = useId();

  const onKey = (e: KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const i = options.findIndex((o) => o.value === value);
    const next = e.key === "Home" ? 0 : e.key === "End" ? options.length - 1 : (i + (e.key === "ArrowRight" ? 1 : -1) + options.length) % options.length;
    const opt = options[next];
    if (!opt) return;
    onChange(opt.value);
    group.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  };

  return (
    <div ref={group} role="radiogroup" aria-label={label} className={cx(s.seg, s[size], className)} onKeyDown={onKey}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button key={o.value} type="button" role="radio" aria-checked={on} tabIndex={on ? 0 : -1} name={name} onClick={() => onChange(o.value)}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
