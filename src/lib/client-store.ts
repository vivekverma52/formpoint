"use client";
/**
 * Minimal persistent store on top of useSyncExternalStore.
 * - SSR-safe: the server snapshot is always the initial value, so hydration never mismatches.
 * - Cross-tab: listens to the `storage` event.
 * - Storage failures (private mode, quota, blocked) degrade to in-memory state.
 */
import { useSyncExternalStore } from "react";

export interface Store<T> {
  get(): T;
  set(next: T | ((prev: T) => T)): void;
  subscribe(fn: () => void): () => void;
}

export function createPersistentStore<T>(key: string, initial: T, validate: (v: unknown) => v is T): Store<T> {
  let state = initial;
  let hydrated = false;
  const listeners = new Set<() => void>();

  const read = () => {
    if (hydrated || typeof window === "undefined") return;
    hydrated = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (validate(parsed)) state = parsed;
      }
    } catch { /* ignore — fall back to initial */ }
  };

  const emit = () => listeners.forEach((l) => l());

  if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
      if (e.key !== key) return;
      hydrated = false;
      read();
      emit();
    });
  }

  return {
    get() { read(); return state; },
    set(next) {
      read();
      state = typeof next === "function" ? (next as (p: T) => T)(state) : next;
      try { window.localStorage.setItem(key, JSON.stringify(state)); } catch { /* in-memory only */ }
      emit();
    },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  };
}

export function useStore<T>(store: Store<T>, serverValue: T): T {
  return useSyncExternalStore(store.subscribe, store.get, () => serverValue);
}

export const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === "string");
