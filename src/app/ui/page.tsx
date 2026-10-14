import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Badge, Button, Card, ChanceBadge, Container, EmptyState, IconButton, IconTile, Icon, LiveBadge, PageHeader, Rail, Skeleton, Stars, Stat } from "@/components/ui";
import { CollegeRow } from "@/components/college/CollegeRow";
import { DeadlineCard, ExamCard, ToolCard } from "@/components/home/HomeCards";
import { getAllColleges, getHome } from "@/lib/api";
import { InteractiveDemos } from "./Demos";

export const metadata: Metadata = { title: "UI kit", robots: { index: false, follow: false } };

function Block({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section style={{ borderTop: "1px solid var(--line)", padding: "28px 0", display: "grid", gap: 14 }}>
      <div><h2 style={{ fontSize: 20 }}>{title}</h2>{note && <p className="mute" style={{ fontSize: 13, marginTop: 4 }}>{note}</p>}</div>
      {children}
    </section>
  );
}
const row = { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" } as const;

/** Living component gallery. Every primitive in both themes — toggle the theme in the header. */
export default async function UiKit() {
  const [colleges, home] = await Promise.all([getAllColleges(), getHome()]);
  const sample = colleges[0]!;
  return (
    <Container>
      <PageHeader eyebrow="Design system" title="FormPoint UI kit" description="Primitives and domain components, rendered from the same code the pages use. Blue = act, green = good value, red = urgent / saved, amber = caution." />

      <Block title="Buttons" note="One component; renders <Link> when href is set. Icon-only buttons require a label.">
        <div style={row}>
          <Button variant="primary">Apply now</Button>
          <Button variant="success">Get counselling</Button>
          <Button variant="solid">Solid</Button>
          <Button>Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Withdraw</Button>
          <Button variant="primary" loading>Submitting</Button>
          <Button iconLeft="download">With icon</Button>
          <IconButton icon="heart" label="Save" />
          <IconButton icon="bell" label="Updates" badge={3} />
        </div>
        <div style={row}><Button size="sm">Small</Button><Button>Medium</Button><Button size="lg" variant="primary">Large</Button></div>
      </Block>

      <Block title="Badges" note="Colour is never the only signal — every badge carries text.">
        <div style={row}>
          <Badge>Neutral</Badge><Badge tone="blue">NIRF #3</Badge><Badge tone="green">High ROI</Badge>
          <Badge tone="red">Closes in 12 days</Badge><Badge tone="amber">Sponsored</Badge>
          <ChanceBadge chance="safe" /><ChanceBadge chance="likely" /><ChanceBadge chance="reach" /><LiveBadge />
        </div>
      </Block>

      <Block title="Stars" note="Partial fills, glossy gradient, glint disabled for reduced motion.">
        <div style={row}><Stars value={4.3} /><Stars value={3.7} /><Stars value={4.8} size="lg" /></div>
      </Block>

      <Block title="Stats & cards">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10 }}>
          <Stat label="Average package" value="24 LPA" hint="2026 batch" tone="blue" />
          <Stat label="Fees back in" value="5 months" hint="Of average salary" tone="green" />
          <Stat label="Fees back in" value="2.8 yrs" tone="red" />
          <Stat label="Fees from" value="₹2.29L" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10 }}>
          <Card><IconTile tone="blue"><Icon name="target" /></IconTile><b>Neutral card</b><span className="mute">Default surface.</span></Card>
          <Card tone="green"><b>Toned · green</b><span className="mute">One accent per card.</span></Card>
          <Card tone="red"><b>Toned · red</b><span className="mute">Urgent states only.</span></Card>
        </div>
      </Block>

      <Block title="Interactive" note="Segmented control, toggle chips, toasts, form fields with hint and error wiring, native dialog.">
        <InteractiveDemos />
      </Block>

      <Block title="Rail" note="Scroll-snap carousel with arrows and dots; swipe and keyboard still work.">
        <Rail label="Demo rail" itemMinWidth={240} showDots>
          {home.deadlines.map((d) => <DeadlineCard key={d.title} deadline={d} />)}
        </Rail>
      </Block>

      <Block title="Domain components">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 10 }}>
          {home.exams[0] && <ExamCard exam={home.exams[0]} />}
          <ToolCard href="/predictor" title="College predictor" description="See where your rank gets you." icon="target" tone="blue" />
        </div>
        <CollegeRow college={sample} position={1} />
      </Block>

      <Block title="States">
        <EmptyState title="No colleges match these filters." description="Remove a filter to see more." action={<Button>Clear filters</Button>} />
        <div style={{ display: "grid", gap: 8 }}><Skeleton width="40%" /><Skeleton height={80} radius={14} /></div>
      </Block>
    </Container>
  );
}
