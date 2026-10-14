import { Container, Skeleton } from "@/components/ui";

/** Streaming fallback for listing navigations: same footprint as real rows, so nothing jumps. */
export default function Loading() {
  return (
    <Container aria-busy="true" aria-label="Loading colleges">
      <div style={{ padding: "48px 0 22px", display: "grid", gap: 12 }}>
        <Skeleton width={180} height={12} />
        <Skeleton width="60%" height={44} />
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {Array.from({ length: 5 }, (_, i) => <Skeleton key={i} height={132} radius={14} />)}
      </div>
    </Container>
  );
}
