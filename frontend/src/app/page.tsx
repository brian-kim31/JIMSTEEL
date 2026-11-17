import Image from "next/image";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ArrowRight, Award, CalendarCheck, Car, MapPin, Phone, ShieldCheck, Star, Truck, Users } from "lucide-react";
import { getPage, getPromotions, getServices, getSite, getVideos } from "@/lib/api";
import { telHref } from "@/lib/format";
import { ServiceCard } from "@/components/ServiceCard";
import { SectionBlock } from "@/components/Sections";
import { YouTube } from "@/components/YouTube";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";

export default async function HomePage() {
  "use cache";
  cacheLife("hours");
  const [site, home, services, promotions, videos] = await Promise.all([
    getSite(),
    getPage("home"),
    getServices(),
    getPromotions(),
    getVideos("home"),
  ]);
  const heroImage = promotions.find((p) => p.image)?.image;
  const phone = site?.phone ?? "0115 922 7805";
  const years = new Date().getFullYear() - (site?.established_year ?? 1982);
  const [training, warranty] = home?.sections ?? [];

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-navy-950 text-white">
        {heroImage && (
          <Image src={heroImage} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-35" />
        )}
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-900/40" />
        <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:py-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm font-medium text-navy-100">
              <MapPin className="size-4 text-red-300" aria-hidden /> Beeston, Nottingham · Est. {site?.established_year ?? 1982}
            </p>
            <h1 className="mt-6 text-5xl font-bold leading-[0.95] sm:text-6xl lg:text-7xl">
              The answer is <span className="text-brand-red">YES.</span>
              <br />
              How can we help you?
            </h1>
            <p className="mt-6 max-w-xl text-lg text-navy-100">
              {home?.headline ?? "Car repairs, servicing and MOTs in Beeston"} – a friendly, family-run independent garage
              giving you main-dealer standards without main-dealer prices.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/book" size="lg">
                <CalendarCheck className="size-5" aria-hidden /> Book online
              </ButtonLink>
              <a
                href={telHref(phone)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/30 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Phone className="size-5" aria-hidden /> {phone}
              </a>
            </div>
          </div>

          {/* Offers */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm sm:p-6">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-red-300">Current offers</p>
            <ul className="mt-4 divide-y divide-white/10">
              {promotions.map((p) => (
                <li key={p.id}>
                  <Link href={p.link} className="group flex items-center justify-between gap-4 py-3.5">
                    <span>
                      <span className="block font-display text-2xl font-bold">{p.title}</span>
                      <span className="text-sm text-navy-200">{p.blurb}</span>
                    </span>
                    <span className="flex items-center gap-2 text-right">
                      <span className="font-display text-xl font-bold text-white">{p.price_label}</span>
                      <ArrowRight className="size-4 text-red-300 transition-transform group-hover:translate-x-1" aria-hidden />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Trust strip */}
      <section className="border-b border-line bg-white">
        <Container className="grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          {[
            { icon: Users, title: `${years}+ years`, text: "Three generations of the Steel family" },
            { icon: ShieldCheck, title: "Warranty safe", text: "Manufacturer-spec parts & servicing" },
            { icon: Award, title: "Trust My Garage", text: "Member of the national network" },
            { icon: Truck, title: "Vans up to 4 tonnes", text: "Including LWB & Luton vans" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3">
              <Icon className="size-8 shrink-0 text-brand-red" aria-hidden />
              <div>
                <p className="font-display text-xl font-bold text-navy-900">{title}</p>
                <p className="text-sm text-muted">{text}</p>
              </div>
            </div>
          ))}
        </Container>
      </section>

      {/* Services */}
      <section className="bg-surface py-20">
        <Container>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Eyebrow>What we do</Eyebrow>
              <h2 className="mt-2 text-4xl font-bold text-navy-900 sm:text-5xl">From Audi to Volvo</h2>
              <p className="mt-3 max-w-2xl text-muted">
                The same standard of care as the main dealers, with clear, upfront pricing.
              </p>
            </div>
            <ButtonLink href="/services" variant="outline">
              All services <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </Container>
      </section>

      {/* About + warranty */}
      <section className="py-20">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="space-y-5">
            <Eyebrow>Family-run since {site?.established_year ?? 1982}</Eyebrow>
            <h2 className="text-4xl font-bold text-navy-900 sm:text-5xl">A staple of the Beeston community</h2>
            {home?.intro.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed text-muted">
                {p}
              </p>
            ))}
            {training && <SectionBlock section={{ ...training, heading: "" }} />}
            <ButtonLink href="/about" variant="navy">
              Our story <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
          <div className="space-y-6">
            {videos[0] && <YouTube id={videos[0].youtube_id} title={videos[0].title} />}
            {warranty && (
              <div className="rounded-3xl bg-navy-700 p-7 text-white sm:p-8">
                <ShieldCheck className="size-10 text-red-300" aria-hidden />
                <h3 className="mt-4 text-3xl font-bold">{warranty.heading}</h3>
                {warranty.body.map((p, i) => (
                  <p key={i} className="mt-3 leading-relaxed text-navy-100">
                    {p}
                  </p>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Reviews + visit */}
      <section id="reviews" className="bg-surface py-20">
        <Container className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-line bg-white p-8 lg:col-span-1">
            <div className="flex gap-1 text-amber-400" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-6 fill-current" />
              ))}
            </div>
            <h2 className="mt-4 text-3xl font-bold text-navy-900">Read what our customers say</h2>
            <p className="mt-3 text-muted">
              Had work done with us? A Google review also earns you a stamp on your Loyalty Bingo Card.
            </p>
            {site?.google_reviews_url && (
              <ButtonLink href={site.google_reviews_url} target="_blank" rel="noopener noreferrer" variant="navy" className="mt-6">
                Google reviews <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            )}
          </div>
          <div className="overflow-hidden rounded-3xl border border-line bg-white lg:col-span-2">
            <div className="grid h-full md:grid-cols-2">
              {site?.map_embed_url && (
                <iframe
                  src={site.map_embed_url}
                  title="Map showing Jim Steel Garage Services on Station Road, Beeston"
                  className="h-64 w-full md:h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}
              <div className="p-8">
                <Car className="size-9 text-brand-red" aria-hidden />
                <h2 className="mt-3 text-3xl font-bold text-navy-900">Visit the garage</h2>
                {site && (
                  <address className="mt-3 not-italic text-muted">
                    {site.address_line1}, {site.town}
                    <br />
                    {site.county} {site.postcode}
                  </address>
                )}
                <ul className="mt-4 space-y-1 text-sm text-ink">
                  {site?.opening_hours.map((h) => <li key={h}>{h}</li>)}
                </ul>
                <p className="mt-4 text-sm text-muted">Free collection & delivery and courtesy cars available.</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-brand-red text-white">
        <Container className="flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
          <div>
            <h2 className="text-4xl font-bold">Ready when you are.</h2>
            <p className="mt-1 text-red-100">Book online in a couple of minutes, or give the team a call.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/book" variant="light" size="lg">
              Book online
            </ButtonLink>
            <ButtonLink href={telHref(phone)} variant="ghostLight" size="lg">
              Call {phone}
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
