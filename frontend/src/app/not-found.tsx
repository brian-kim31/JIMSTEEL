import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="font-display text-7xl font-bold text-brand-red">404</p>
      <h1 className="mt-4 text-4xl font-bold text-navy-900">We couldn’t find that page</h1>
      <p className="mt-3 text-muted">It may have moved when we updated our website.</p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/">Home</ButtonLink>
        <ButtonLink href="/services" variant="outline">
          Our services
        </ButtonLink>
      </div>
    </Container>
  );
}
