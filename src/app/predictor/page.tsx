import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs, Container, PageHeader, Skeleton } from "@/components/ui";
import { Predictor, type PredictorCollege } from "@/components/tools/Predictor";
import { getAllColleges, getExams } from "@/lib/api";

export const metadata: Metadata = {
  title: "College predictor 2026 — JEE Main, JEE Advanced, NEET, CAT, CLAT",
  description: "Free college and rank predictor: see Safe, Likely and Reach colleges for your exam, category and rank. No sign-up.",
  alternates: { canonical: "/predictor" },
};
export const revalidate = 3600;

export default async function PredictorPage() {
  const [exams, all] = await Promise.all([getExams(), getAllColleges()]);
  // Only the fields the client needs — keeps the RSC payload small.
  const colleges: PredictorCollege[] = all.flatMap((c) =>
    c.cutoff ? [{ slug: c.slug, name: c.name, fullName: c.fullName, nirf: c.nirf, cutoff: c.cutoff }] : [],
  );
  return (
    <Container>
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Predictor" }]} />
      <PageHeader eyebrow="Free tools · no sign-up" title="College predictor" description="Enter your exam, category and rank to see where you stand against last year's closing values." />
      {/* useSearchParams needs a Suspense boundary so the shell can still be prerendered. */}
      <Suspense fallback={<Skeleton height={420} radius={14} />}>
        <Predictor exams={exams} colleges={colleges} />
      </Suspense>
    </Container>
  );
}
