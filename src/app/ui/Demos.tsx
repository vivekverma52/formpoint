"use client";
import { useState } from "react";
import { Button, Chip, Dialog, Input, Segmented, Select, useToast } from "@/components/ui";

export function InteractiveDemos() {
  const toast = useToast();
  const [seg, setSeg] = useState<"cities" | "states">("cities");
  const [chips, setChips] = useState<string[]>(["B.Tech"]);
  const [open, setOpen] = useState(false);
  const toggle = (k: string) => setChips((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k]));
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Segmented label="Places" value={seg} onChange={setSeg} options={[{ value: "cities", label: "Cities" }, { value: "states", label: "States" }]} />
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {["B.Tech", "MBA", "MBBS"].map((k) => <Chip key={k} activeTone="blue" pressed={chips.includes(k)} onClick={() => toggle(k)}>{k}</Chip>)}
        <Chip removable onClick={() => toast.show("Filter removed")}>New Delhi</Chip>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Button onClick={() => toast.show("Saved to your shortlist.", "red")}>Toast · red</Button>
        <Button onClick={() => toast.show("Application submitted.", "green")}>Toast · green</Button>
        <Button variant="primary" onClick={() => setOpen(true)}>Open dialog</Button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10 }}>
        <Input label="Full name" placeholder="Asha Verma" hint="As on your Class 12 marksheet." />
        <Input label="Mobile number" defaultValue="12345" error="Enter a 10-digit Indian mobile number." />
        <Select label="Course" options={["B.Tech", "MBA", "MBBS"]} />
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} eyebrow="Dialog" title="Native <dialog> modal" description="Focus is trapped, Escape closes, focus returns to the button.">
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => setOpen(false)}>Confirm</Button>
        </div>
      </Dialog>
    </div>
  );
}
