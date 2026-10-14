"use client";
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import type { Tone } from "@/lib/types";
import s from "./Toast.module.css";

interface ToastItem { id: number; message: string; tone: Tone }
interface ToastApi { show: (message: string, tone?: Tone) => void }

const ToastContext = createContext<ToastApi | null>(null);

/** Wrap the app once. Toasts are announced politely to screen readers. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const seq = useRef(0);

  const show = useCallback((message: string, tone: Tone = "neutral") => {
    const id = ++seq.current;
    setItems((prev) => [...prev.slice(-2), { id, message, tone }]);
    window.setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className={s.region} role="status" aria-live="polite">
        {items.map((t) => <div key={t.id} className={cx(s.toast, s[t.tone])}>{t.message}</div>)}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
