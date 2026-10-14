"use client";
import { createContext, useCallback, useContext, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Badge, Button, Dialog, Input, Select, useToast } from "@/components/ui";
import type { ButtonProps } from "@/components/ui";
import { COURSES, CITIES } from "@/lib/data/sample";
import { addApplications } from "./stores";
import s from "./Apply.module.css";

interface Target { slug: string; name: string }
interface ApplyApi { open: (targets: Target[], course?: string) => void }
const ApplyContext = createContext<ApplyApi | null>(null);

export function useApply() {
  const ctx = useContext(ApplyContext);
  if (!ctx) throw new Error("useApply must be used inside <ApplyProvider>");
  return ctx;
}

/**
 * One dialog for the whole app: counselling requests (no targets),
 * single applications, and one-form apply-to-many.
 */
export function ApplyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ targets: Target[]; course?: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const open = useCallback((targets: Target[], course?: string) => { setErrors({}); setState({ targets, course }); }, []);
  const close = useCallback(() => setState(null), []);
  const api = useMemo(() => ({ open }), [open]);

  const targets = state?.targets ?? [];
  const multi = targets.length > 1;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const phone = String(data.get("phone") ?? "").replace(/\s+/g, "");
    const next: Record<string, string> = {};
    if (!String(data.get("name") ?? "").trim()) next.name = "Enter your full name.";
    if (!/^(\+91)?[6-9]\d{9}$/.test(phone)) next.phone = "Enter a 10-digit Indian mobile number.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    // Live: await fetch("/api/applications", { method: "POST", body: data }) — handled by NestJS.
    await new Promise((r) => setTimeout(r, 400));
    setBusy(false);

    if (targets.length) {
      addApplications(targets.map((t) => ({ ...t, course: String(data.get("course")) })));
      toast.show(`${targets.length} application${multi ? "s" : ""} saved. Track ${multi ? "them" : "it"} under My applications.`, "green");
    } else {
      toast.show("Request noted. An advisor will call you within a day.", "green");
    }
    close();
  }

  return (
    <ApplyContext.Provider value={api}>
      {children}
      <Dialog
        open={state !== null}
        onClose={close}
        eyebrow={targets.length ? "One-form application" : "Free counselling"}
        title={multi ? `Apply to ${targets.length} colleges` : targets[0] ? `Apply to ${targets[0].name}` : "Talk to an admissions advisor"}
        description={targets.length ? "Fill this once. Each college gets your details, and you can track every application in one place." : "Get a shortlist built around your rank, budget and city."}
      >
        {targets.length > 0 && <div className={s.targets}>{targets.map((t) => <Badge key={t.slug} tone="blue">{t.name}</Badge>)}</div>}
        <form className={s.form} onSubmit={submit} noValidate>
          <Input name="name" label="Full name" autoComplete="name" required error={errors.name} />
          <div className={s.row}>
            <Input name="phone" label="Mobile number" type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" required error={errors.phone} />
            <Input name="email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" />
          </div>
          <div className={s.row}>
            <Select name="course" label="Course" options={COURSES.map((c) => c.key)} defaultValue={state?.course ?? COURSES[0]?.key} />
            <Select name="city" label="Preferred city" options={["Anywhere in India", ...CITIES.map((c) => c.name)]} />
          </div>
          <p className={s.consent}>By submitting you agree to be contacted by FormPoint and the colleges listed above. We never sell your number.</p>
          <div className={s.actions}>
            <Button onClick={close}>Cancel</Button>
            <Button type="submit" variant="primary" loading={busy}>
              {targets.length ? (multi ? `Submit ${targets.length} applications` : "Submit application") : "Request a call"}
            </Button>
          </div>
        </form>
      </Dialog>
    </ApplyContext.Provider>
  );
}

type ApplyButtonProps = { targets?: Target[]; course?: string } & Omit<Extract<ButtonProps, { href?: undefined }>, "onClick">;

/** Opens the shared apply dialog. With no targets it becomes a counselling CTA. */
export function ApplyButton({ targets = [], course, children, variant = "primary", ...rest }: ApplyButtonProps) {
  const { open } = useApply();
  return <Button variant={variant} {...rest} onClick={() => open(targets, course)}>{children}</Button>;
}
