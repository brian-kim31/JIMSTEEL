import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { getSite } from "@/lib/api";
import { telHref } from "@/lib/format";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Book Online",
  description: "Book your service, MOT, air-con re-gas or repair online with Jim Steel Garage Services, Beeston.",
};

export default async function BookPage() {
  const site = await getSite();
  const phone = site?.phone ?? "0115 922 7805";
  return (
    <>
      <PageHeader
        eyebrow="Book now"
        title="Book your vehicle in"
        intro="Choose your service and a time that suits you. Your booking goes straight into our workshop diary."
      />
      <section className="bg-surface py-12 sm:py-16">
        <Container className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="overflow-hidden rounded-3xl border border-line bg-white">
            {site?.booking_url ? (
              <iframe
                src={site.booking_url}
                title="Online booking"
                className="block min-h-[760px] w-full border-0"
                loading="lazy"
              />
            ) : (
              <p className="p-8 text-muted">Online booking is temporarily unavailable – please call us on {phone}.</p>
            )}
          </div>
          <aside className="space-y-6">
            <div className="rounded-3xl bg-navy-900 p-6 text-white">
              <h2 className="text-2xl font-bold">Prefer to talk?</h2>
              <p className="mt-2 text-sm text-navy-100">{site?.opening_hours.join(" · ")}</p>
              <a
                href={telHref(phone)}
                className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-brand-red py-3 font-semibold text-white hover:bg-brand-red-dark"
              >
                <Phone className="size-4" aria-hidden /> {phone}
              </a>
            </div>
            <div className="rounded-3xl border border-line bg-white p-6">
              <h2 className="text-2xl font-bold text-navy-900">Arrange a call back</h2>
              <p className="mb-5 mt-1 text-sm text-muted">Leave your number and we’ll ring you.</p>
              <EnquiryForm kind="callback" />
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
