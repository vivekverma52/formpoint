"use client";
import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui";
import { ApplyProvider } from "@/components/shortlist/Apply";

/** All client-side context in one place, mounted once by the root layout. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ApplyProvider>{children}</ApplyProvider>
    </ToastProvider>
  );
}
