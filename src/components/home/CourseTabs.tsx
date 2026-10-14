"use client";
import { useId, useState, type ReactNode } from "react";
import { Button, Chip } from "@/components/ui";
import s from "./CourseTabs.module.css";

export interface CourseTab { key: string; href: string; panel: ReactNode }

/**
 * Tabs whose panels are server-rendered and passed in as props, so switching is
 * instant and every panel's links are in the HTML for crawlers.
 */
export function CourseTabs({ tabs }: { tabs: CourseTab[] }) {
  const [active, setActive] = useState(tabs[0]?.key);
  const id = useId();
  const current = tabs.find((t) => t.key === active) ?? tabs[0];
  const tid = (k: string) => `${id}-tab-${k.replace(/[^a-z0-9]+/gi, "-")}`;
  return (
    <div>
      <div className={s.bar}>
        <div role="tablist" aria-label="Course" className={s.tabs}>
          {tabs.map((t) => (
            <Chip key={t.key} role="tab" id={tid(t.key)} aria-selected={t.key === active}
              aria-controls={`${id}-panel`} onClick={() => setActive(t.key)}>{t.key}</Chip>
          ))}
        </div>
        {current && <Button size="sm" href={current.href} iconRight="arrowRight">See all {current.key}</Button>}
      </div>
      {tabs.map((t) => (
        <div key={t.key} id={t.key === active ? `${id}-panel` : undefined} role="tabpanel" aria-labelledby={tid(t.key)} hidden={t.key !== active}>
          {t.panel}
        </div>
      ))}
    </div>
  );
}
