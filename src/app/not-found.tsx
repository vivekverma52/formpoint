import { Button, Container, PageHeader } from "@/components/ui";

export default function NotFound() {
  return (
    <Container>
      <PageHeader eyebrow="404" title="We couldn't find that page" description="It may have moved, or the link may be mistyped. Try searching for the college or course instead." />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingBottom: 40 }}>
        <Button href="/colleges" variant="primary" iconLeft="search">Browse colleges</Button>
        <Button href="/">Go home</Button>
      </div>
    </Container>
  );
}
