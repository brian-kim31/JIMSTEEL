import type { Metadata } from "next";
import { getServices } from "@/lib/api";
import { ServiceCard } from "@/components/ServiceCard";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Services",
  description: "Servicing, MOTs, diagnostics, electric & hybrid, air conditioning and more at Jim Steel Garage Services, Beeston.",
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHeader
        eyebrow="What we do"
        title="Everything your vehicle needs, under one roof"
        intro="Fully trained technicians, manufacturer-spec parts and clear pricing – for cars and light commercial vehicles up to four tonnes."
      />
      <section className="bg-surface py-16 sm:py-20">
        <Container className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </Container>
      </section>
    </>
  );
}
