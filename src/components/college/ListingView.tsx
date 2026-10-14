import { Suspense } from "react";
import { Breadcrumbs, Button, Container, EmptyState, PageHeader } from "@/components/ui";
import { ActiveFilters, FilterPanel, ResultsToolbar } from "@/components/filters/FilterPanel";
import { searchColleges } from "@/lib/api";
import { collegesHref, toQuery } from "@/lib/filters";
import type { CollegeFilters } from "@/lib/types";
import { CollegeRow } from "./CollegeRow";
import s from "./ListingView.module.css";

export function listingTitle(f: Partial<CollegeFilters>) {
  const what = f.course ?? f.stream ?? "";
  return `Top ${what ? `${what} ` : ""}colleges in ${f.city ?? f.state ?? "India"}`;
}

/**
 * Shared by /colleges (query-string filters) and /colleges/[slug] (SEO landing pages).
 * Results are server-rendered; filter controls are small client islands that edit the URL.
 */
export async function ListingView({ filters, seed = {} }: { filters: CollegeFilters; seed?: Partial<CollegeFilters> }) {
  const result = await searchColleges(filters);
  const pages = Math.ceil(result.total / result.pageSize);
  const base = filters;

  return (
    <Container>
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Colleges", href: "/colleges" }, ...(filters.course ? [{ name: filters.course }] : [])]} />
      <PageHeader
        eyebrow={`Ranked list · ${result.total} result${result.total === 1 ? "" : "s"}`}
        title={listingTitle(filters)}
        description="Compare fees, packages and how fast the fees pay back. Sponsored listings are always labelled and never change the rank order."
      />
      <div className={s.layout}>
        <Suspense fallback={<div className={s.filterFallback} />}>
          <FilterPanel seed={seed} />
        </Suspense>
        <div className={s.results}>
          <Suspense fallback={null}>
            <ResultsToolbar seed={seed} />
            <ActiveFilters seed={seed} />
          </Suspense>
          {result.items.length === 0 ? (
            <EmptyState title="No colleges match these filters." description="Remove a filter or widen the fee range to see more." action={<Button href="/colleges">Clear all filters</Button>} />
          ) : (
            <ol className={s.list} start={(result.page - 1) * result.pageSize + 1}>
              {result.items.map((c, i) => (
                <li key={c.slug}><CollegeRow college={c} course={filters.course} position={(result.page - 1) * result.pageSize + i + 1} /></li>
              ))}
            </ol>
          )}
          {pages > 1 && (
            <nav className={s.pager} aria-label="Pagination">
              {result.page > 1 && <Button href={`/colleges${toQuery({ ...base, page: result.page - 1 })}`} iconLeft="chevronLeft" rel="prev">Previous</Button>}
              <span className="num mute">Page {result.page} of {pages}</span>
              {result.page < pages && <Button href={`/colleges${toQuery({ ...base, page: result.page + 1 })}`} iconRight="chevronRight" rel="next">Next</Button>}
            </nav>
          )}
          <p className={s.related}>
            Related: <a href={collegesHref({ ...filters, sort: "roi" })}>fastest fee payback</a> · <a href={collegesHref({ ...filters, ownership: "Government" })}>government only</a>
          </p>
        </div>
      </div>
    </Container>
  );
}
