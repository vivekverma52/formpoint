"use client";
import { useEffect, useState } from "react";
import { IconButton } from "./Button";

type Theme = "light" | "dark";
const KEY = "fp-theme";

/** Runs before paint (inlined in <head>) so the saved theme never flashes. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}})()`;

function current(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(current());
    const mq = matchMedia("(prefers-color-scheme: light)");
    const sync = () => setTheme(current());
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const toggle = () => {
    const next: Theme = current() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(KEY, next); } catch { /* private mode */ }
    setTheme(next);
  };

  // Until mounted, render a neutral button of the same size so layout doesn't shift.
  const isDark = theme !== "light";
  return <IconButton icon={isDark ? "sun" : "moon"} label={isDark ? "Switch to light mode" : "Switch to dark mode"} onClick={toggle} />;
}
