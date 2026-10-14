"use client";
import Link from "next/link";
import { Badge, Button, Card, EmptyState } from "@/components/ui";
import { ApplyButton } from "@/components/shortlist/Apply";
import { SaveButton } from "@/components/shortlist/ShortlistControls";
import { useApplications, useShortlist } from "@/components/shortlist/stores";
import { lakh, paybackLabel, paybackMonths, programmeFor } from "@/lib/format";
import type { College } from "@/lib/types";
import s from "./Tools.module.css";

const STEPS = ["Submitted", "Documents verified", "Shortlisted", "Offer"] as const;
const STEP_INDEX = { submitted: 0, verified: 1, shortlisted: 2, offer: 3 } as const;

export function ShortlistView({ colleges }: { colleges: College[] }) {
  const saved = useShortlist();
  const apps = useApplications();
  const list = saved.map((sl) => colleges.find((c) => c.slug === sl)).filter((c): c is College => Boolean(c));
  const notApplied = list.filter((c) => !apps.some((a) => a.slug === c.slug));

  return (
    <div className={s.two}>
      <Card padding="lg">
        <div className={s.rowHead}>
          <h2 className={s.h}>Shortlist · {list.length}</h2>
          {notApplied.length > 1 && (
            <ApplyButton size="sm" iconLeft="form" targets={notApplied.map((c) => ({ slug: c.slug, name: c.name }))}>
              Apply to {notApplied.length} with one form
            </ApplyButton>
          )}
        </div>
        {list.length === 0 ? (
          <EmptyState title="Nothing saved yet." description="Tap the heart on any college to save it here." action={<Button href="/colleges">Browse colleges</Button>} />
        ) : (
          <ul className={s.list}>
            {list.map((c) => {
              const applied = apps.some((a) => a.slug === c.slug);
              return (
                <li key={c.slug}>
                  <span className={s.listMain}>
                    <Link href={`/college/${c.slug}`}>{c.fullName}</Link>
                    <span className="num mute">{lakh(programmeFor(c).feePerYear)}/yr · fees back in {paybackLabel(paybackMonths(c))}</span>
                  </span>
                  {applied ? <Badge tone="blue">Applied</Badge> : <ApplyButton size="sm" targets={[{ slug: c.slug, name: c.name }]}>Apply</ApplyButton>}
                  <SaveButton slug={c.slug} name={c.name} />
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card padding="lg">
        <h2 className={s.h}>Applications · {apps.length}</h2>
        {apps.length === 0 ? (
          <EmptyState title="No applications yet." description="Applications you send from any college page show up here." />
        ) : (
          <>
            {apps.map((a) => (
              <div key={a.slug} className={s.app}>
                <div>
                  <Link href={`/college/${a.slug}`}><b>{a.name}</b></Link>
                  <div className="mute" style={{ fontSize: 12 }}>{a.course} · applied {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                  <ol className={s.steps} aria-label="Application progress">
                    {STEPS.map((st, i) => <li key={st} data-done={i <= STEP_INDEX[a.status] || undefined}>{st}</li>)}
                  </ol>
                </div>
                <Badge tone="blue" shape="pill">{STEPS[STEP_INDEX[a.status]]}</Badge>
              </div>
            ))}
            <p className={s.note}>Colleges update these steps. Saved on this device until sign-in is added.</p>
          </>
        )}
      </Card>
    </div>
  );
}
