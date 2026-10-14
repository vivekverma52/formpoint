"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { IconButton } from "./Button";
import s from "./Dialog.module.css";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  description?: ReactNode;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

/**
 * Modal built on the native <dialog>: focus trap, Escape, inert background and
 * top-layer stacking come from the browser. Focus returns to the opener on close.
 */
export function Dialog({ open, onClose, title, eyebrow, description, children, size = "md" }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      opener.current = document.activeElement;
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const handleClose = () => {
      document.documentElement.style.overflow = "";
      (opener.current as HTMLElement | null)?.focus?.();
      onClose();
    };
    d.addEventListener("close", handleClose);
    return () => d.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      className={cx(s.dialog, s[size])}
      aria-labelledby="dlg-title"
      onClick={(e) => { if (e.target === e.currentTarget) ref.current?.close(); }}
    >
      <div className={s.body}>
        <div className={s.head}>
          <div>
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
            <h2 id="dlg-title" className={s.title}>{title}</h2>
            {description && <div className={s.desc}>{description}</div>}
          </div>
          <IconButton icon="close" label="Close" variant="ghost" size="sm" onClick={() => ref.current?.close()} />
        </div>
        {open && children}
      </div>
    </dialog>
  );
}
