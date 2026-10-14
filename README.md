# FormPoint — web frontend

College discovery, comparison and one-form applications. Next.js 15 (App Router) · React 19 · TypeScript (strict) · CSS Modules on design tokens. No UI library, no CSS framework, no state library: **103 kB shared JS**, every page server-rendered.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # type-checks, prerenders 48 pages
npm start
```

Open **`/ui`** for the living component gallery (every primitive in both themes).

## Structure

```
src/
  app/                      Routes (server components by default)
    page.tsx                Home — ISR, 1h
    colleges/page.tsx       Filtered listing (URL = state, noindex)
    colleges/[slug]/        SEO landing pages: /colleges/btech-colleges-in-delhi (SSG + ISR)
    college/[slug]/         College detail — SSG + ISR, JSON-LD, metadata
    predictor/ compare/ shortlist/ rankings/ news/[slug]/ ui/
    sitemap.ts robots.ts not-found.tsx providers.tsx
  middleware.ts             308s /colleges?course=… to its SEO URL (only if indexable)
  components/
    ui/                     Domain-agnostic primitives (Button, Badge, Card, Chip, Dialog,
                            Field, Icon, Layout, Rail, Segmented, Stars, Toast, ThemeToggle)
    college/                CollegeRow, RankTable, ListingView, CollegeSections, Monogram
    home/                   StudyPlanCard, CourseTile, DeadlineCard, ExamCard, ToolCard, CourseTabs…
    filters/                FilterPanel, ResultsToolbar, ActiveFilters (URL-driven)
    layout/                 Header, Footer, SearchBox (ARIA combobox), MegaMenu
    shortlist/              Persistent stores, Save/Compare buttons, CompareTray, Apply dialog
    tools/                  Predictor, CompareView, ShortlistView
  lib/
    api.ts                  THE data layer — every read goes through here
    filters.ts              Typed, allow-listed URL filters (parse + serialise)
    seo-paths.ts            Programmatic SEO slugs + indexability rule
    predictor.ts            Pure predictor maths (unit-test this)
    format.ts               ₹/LPA formatting, fee payback (ROI)
    site.ts                 Site config + JSON-LD builders
    client-store.ts         useSyncExternalStore + localStorage, SSR-safe
    data/sample.ts          Sample data (replace via api.ts)
  styles/tokens.css         Design tokens — the only place colours live
```

## Design rules

* **Colour = meaning.** Blue = act, green = good value, red = urgent/saved, amber = caution/sponsored. Never colour alone: every badge has text, best-in-row has ▲ + screen-reader text.
* **Tokens only.** Components read `var(--…)`; dark-first with light mode via `prefers-color-scheme` and a `data-theme` toggle (no flash — inline init script).
* **Server first.** Client components are small islands (`"use client"` at file top): buttons that touch stores, the filter panel, search, dialog, carousel.
* **URL is state.** Filters, sort, predictor mode/exam live in the query string — shareable, back-button safe, server-rendered.
* **Accessible by construction.** Native `<dialog>`, ARIA combobox search, radiogroup segmented control, `aria-pressed` toggles, labelled icon buttons (required prop), skip link, visible focus, reduced-motion respected (including the SMIL star glint).

## Component API (selected)

```tsx
<Button variant="primary|success|solid|outline|ghost|danger" size="sm|md|lg"
        iconLeft="heart" iconRight="arrowRight" loading href="/x" />   // <Link> when href
<IconButton icon="heart" label="Save IIT Bombay" badge={3} />          // label is required
<Badge tone="green" shape="tag|pill">High ROI</Badge>  <ChanceBadge chance="safe" />
<Card tone="red" padding="lg" interactive />   <Stat label="Fees back in" value="5 months" tone="green" />
<Stars value={4.3} size="lg" />                // partial fills; needs <StarDefs/> once (in layout)
<Rail label="News" itemMinWidth={260} autoplayMs={4500} showDots>{cards}</Rail>
<Segmented label="Places" value={v} onChange={setV} options={[…]} />
<Dialog open onClose title eyebrow description>…</Dialog>
<Input label hint error />  <Select label options />                  // aria-describedby/invalid wired
const toast = useToast(); toast.show("Saved", "green");
<ApplyButton targets={[{ slug, name }]} course="B.Tech" />            // one dialog app-wide
<SaveButton slug name withLabel />  <CompareButton slug name />
```

## Going live

1. **Data:** set `FORMPOINT_API_URL` and replace function bodies in `src/lib/api.ts` with `apiFetch(...)` calls (signatures stay). Cache tags are already named (`college:<slug>`, `colleges`) — call `revalidateTag()` from a CMS webhook route.
2. **Search:** back `searchColleges` with Typesense/OpenSearch; swap `SearchBox`'s local filter for a debounced query.
3. **Indexability in middleware:** replace `isIndexableSlug` with a nightly-built slug set (Edge Config / S3 JSON) — middleware must not hit the database.
4. **Applications:** POST the Apply form to the NestJS API (stub marked in `Apply.tsx`); move shortlist/applications from localStorage to the account once sign-in exists.
5. **Self-hosting on ECS:** configure a shared `cacheHandler` (Redis) so all containers share the ISR cache, and invalidate CloudFront on revalidation.
6. **Sitemaps:** switch `sitemap.ts` to `generateSitemaps()` (50k URLs per file) once real data lands.
7. **Logos/photos:** replace `Monogram` and the gallery placeholders with `next/image` (AVIF, fixed sizes).

All figures in `data/sample.ts` are illustrative.
