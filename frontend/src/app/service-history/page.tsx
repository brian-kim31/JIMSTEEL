import type { Metadata } from "next";
import { ExternalLink, FileClock, KeyRound, ShieldCheck } from "lucide-react";
import { getSite } from "@/lib/api";
import { ButtonLink, Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Service History",
  description: "View your vehicle's digital service history with Jim Steel Garage Services.",
};

export default async function ServiceHistoryPage() {
  const site = await getSite();
  return (
    <>
      <PageHeader
        eyebrow="Customer portal"
        title="Your vehicle’s service history"
        intro="Every job we do is logged to your vehicle’s digital service record. Log in to view invoices, advisories and upcoming due dates."
      />
      <section className="py-16">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <ul className="space-y-5">
            {[
              { icon: FileClock, title: "Full history", text: "Services, MOTs and repairs we’ve carried out on your vehicle." },
              { icon: ShieldCheck, title: "Advisories", text: "Work we’ve recommended, so nothing gets forgotten." },
              { icon: KeyRound, title: "Secure login", text: "Use the details provided by our reception team." },
            ].map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-700">
                  <Icon className="size-6" aria-hidden />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-navy-900">{title}</h2>
                  <p className="text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="rounded-3xl bg-navy-900 p-8 text-white">
            <h2 className="text-3xl font-bold">Open the service history portal</h2>
            <p className="mt-2 text-navy-100">The portal opens securely in a new tab.</p>
            {site?.service_history_url && (
              <ButtonLink href={site.service_history_url} target="_blank" rel="noopener noreferrer" size="lg" className="mt-6">
                Log in to portal <ExternalLink className="size-4" aria-hidden />
              </ButtonLink>
            )}
            <p className="mt-6 text-sm text-navy-200">
              No login yet? Call us on {site?.phone} and we’ll set you up.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
