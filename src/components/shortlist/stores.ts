"use client";
import { createPersistentStore, isStringArray, useStore } from "@/lib/client-store";

export const MAX_COMPARE = 3;

export interface Application {
  slug: string;
  name: string;
  course: string;
  /** ISO timestamp */
  createdAt: string;
  status: "submitted" | "verified" | "shortlisted" | "offer";
}

const isApplications = (v: unknown): v is Application[] =>
  Array.isArray(v) && v.every((a) => a && typeof a === "object" && typeof (a as Application).slug === "string");

export const shortlistStore = createPersistentStore<string[]>("fp-shortlist", [], isStringArray);
export const compareStore = createPersistentStore<string[]>("fp-compare", [], isStringArray);
export const applicationsStore = createPersistentStore<Application[]>("fp-applications", [], isApplications);

const EMPTY: never[] = [];
export const useShortlist = () => useStore(shortlistStore, EMPTY as string[]);
export const useCompare = () => useStore(compareStore, EMPTY as string[]);
export const useApplications = () => useStore(applicationsStore, EMPTY as Application[]);

export function toggleShortlist(slug: string): boolean {
  let added = false;
  shortlistStore.set((prev) => {
    added = !prev.includes(slug);
    return added ? [...prev, slug] : prev.filter((s) => s !== slug);
  });
  return added;
}

/** Returns "added" | "removed" | "full" so the UI can explain a no-op. */
export function toggleCompare(slug: string): "added" | "removed" | "full" {
  const cur = compareStore.get();
  if (cur.includes(slug)) { compareStore.set(cur.filter((s) => s !== slug)); return "removed"; }
  if (cur.length >= MAX_COMPARE) return "full";
  compareStore.set([...cur, slug]);
  return "added";
}

export function addApplications(items: Omit<Application, "createdAt" | "status">[]) {
  const now = new Date().toISOString();
  applicationsStore.set((prev) => [
    ...prev,
    ...items.filter((i) => !prev.some((p) => p.slug === i.slug)).map((i) => ({ ...i, createdAt: now, status: "submitted" as const })),
  ]);
  shortlistStore.set((prev) => [...new Set([...prev, ...items.map((i) => i.slug)])]);
}
