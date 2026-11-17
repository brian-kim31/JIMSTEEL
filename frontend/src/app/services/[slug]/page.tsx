import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarCheck, Phone } from "lucide-react";
import { getService, getServices, getSite } from "@/lib/api";
import { formatPrice, telHref } from "@/lib/format";
import { PriceCard } from "@/components/PriceCard";
import { SectionBlock } from "@/components/Sections";
import { ServiceIcon } from "@/components/ServiceIcon";
import { EnquiryForm } from "@/components/EnquiryForm";
import { ButtonLink, Container } from "@/components/ui";

const FALLBACK_SLUGS = ["servicing", "mot", "diagnostics", "electric-servicing", "air-conditioning", "loyalty-bingo-card"];

export async function generateStaticParams() {
  const services = await getServices();
  const slugs = services.length ? services.map((s) => s.slug) : FALLBACK_SLUGS;
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Service not found" };
  return { title: service.title, description: service.summary };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const [service, services, site] = await Promise.all([getService(slug), getServices(), getSite()]);
  if (!service) notFound();
  const phone = site?.phone ?? "0115 922 7805";
  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <>
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div aria-hidden className="absolute -right-20 -top-20 size-80 rounded-full bg-brand-red/25 blur-3xl" />
        <Container className="relative py-12 sm:py-16">
          <Link href="/services" className="inline-flex items-center gap-1.5 text-sm text-navy-200 hover:text-white">
            <ArrowLeft className="size-4" aria-hidden /> All services
          </Link>
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-brand-red">
              <ServiceIcon name={service.icon} className="size-8" />
            </span>
            <div>
              <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">{service.title}</h1>
              {service.headline && <p className="mt-2 text-lg text-navy-100">{service.headline}</p>}
            </div>
          </div>
          {service.price_from && (
            <p className="mt-6 inline-flex items-baseline gap-2 rounded-full bg-white/10 px-4 py-2">
              <span className="text-sm text-navy-100">From</span>
              <span className="font-display text-2xl font-bold">{formatPrice(service.price_from)}</span>
            </p>
          )}
        </Container>
      </section>

      {service.packages.length > 0 && (
        <section className="border-b border-line bg-surface py-14">
          <Container>
            <h2 className="text-3xl font-bold text-navy-900">Prices</h2>
            <div
              className={`mt-8 grid gap-6 ${service.packages.length >= 3 ? "md:grid-cols-3" : service.packages.length === 2 ? "md:grid-cols-2 md:max-w-3xl" : "max-w-md"}`}
            >
              {service.packages.map((p) => (
                <PriceCard key={p.id} pkg={p} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="py-14 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1fr_340px]">
          <div className="space-y-10">
            {service.sections.map((s) => (
              <SectionBlock key={s.id} section={s} />
            ))}
          </div>
          <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-3xl bg-navy-900 p-6 text-white">
              <h2 className="text-2xl font-bold">Book your {service.title.toLowerCase()}</h2>
              <p className="mt-2 text-sm text-navy-100">Pick a time online, or call and we’ll sort it for you.</p>
              <div className="mt-5 space-y-3">
                <ButtonLink href="/book" className="w-full">
                  <CalendarCheck className="size-4" aria-hidden /> Book online
                </ButtonLink>
                <ButtonLink href={telHref(phone)} variant="ghostLight" className="w-full">
                  <Phone className="size-4" aria-hidden /> {phone}
                </ButtonLink>
              </div>
            </div>
            <div className="rounded-3xl border border-line p-6">
              <h2 className="text-xl font-bold text-navy-900">Other services</h2>
              <ul className="mt-3 space-y-1">
                {others.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-navy-800 hover:bg-navy-50"
                    >
                      <ServiceIcon name={s.icon} className="size-4 text-brand-red" />
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </Container>
      </section>

      <section className="bg-surface py-14 sm:py-20">
        <Container className="max-w-3xl">
          <h2 className="text-3xl font-bold text-navy-900">Want an itemised estimate?</h2>
          <p className="mt-2 text-muted">Tell us about your vehicle and a member of the team will come back to you.</p>
          <div className="mt-8 rounded-3xl border border-line bg-white p-6 sm:p-8">
            <EnquiryForm kind="quote" services={services.map((s) => s.title)} defaultService={service.title} submitLabel="Request estimate" />
          </div>
        </Container>
      </section>
    </>
  );
}
