import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getServices, getSite } from "@/lib/api";
import { telHref } from "@/lib/format";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Jim Steel Garage Services, 135 Station Road, Beeston, Nottingham NG9 2AZ. Call 0115 922 7805.",
};

export default async function ContactPage() {
  const [site, services] = await Promise.all([getSite(), getServices()]);
  return (
    <>
      <PageHeader eyebrow="Contact us" title="Get in touch" intro="Send us a message and a member of the team will come back to you – or just pop in." />
      <section className="py-14 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="rounded-3xl border border-line p-6 sm:p-8">
            <h2 className="mb-6 text-3xl font-bold text-navy-900">Send us a message</h2>
            <EnquiryForm kind="contact" services={services.map((s) => s.title)} />
          </div>
          {site && (
            <aside className="space-y-6">
              <ul className="space-y-5 rounded-3xl bg-navy-900 p-7 text-white">
                <li className="flex gap-4">
                  <Phone className="size-6 shrink-0 text-red-300" aria-hidden />
                  <div>
                    <p className="text-sm text-navy-200">Call</p>
                    <a href={telHref(site.phone)} className="font-display text-2xl font-bold">
                      {site.phone}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Mail className="size-6 shrink-0 text-red-300" aria-hidden />
                  <div>
                    <p className="text-sm text-navy-200">Email</p>
                    <a href={`mailto:${site.email}`} className="break-all font-semibold">
                      {site.email}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <MapPin className="size-6 shrink-0 text-red-300" aria-hidden />
                  <div>
                    <p className="text-sm text-navy-200">Address</p>
                    <address className="not-italic">
                      {site.business_name}
                      <br />
                      {site.address_line1}, {site.town}
                      <br />
                      {site.county} {site.postcode}
                    </address>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Clock className="size-6 shrink-0 text-red-300" aria-hidden />
                  <div>
                    <p className="text-sm text-navy-200">Opening hours</p>
                    {site.opening_hours.map((h) => (
                      <p key={h}>{h}</p>
                    ))}
                  </div>
                </li>
              </ul>
              {site.map_embed_url && (
                <iframe
                  src={site.map_embed_url}
                  title="Map showing Jim Steel Garage Services"
                  className="h-72 w-full rounded-3xl border border-line"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}
            </aside>
          )}
        </Container>
      </section>
    </>
  );
}
