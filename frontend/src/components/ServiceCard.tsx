import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ServiceSummary } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { ServiceIcon } from "./ServiceIcon";

export function ServiceCard({ service }: { service: ServiceSummary }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative flex flex-col rounded-2xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-lg hover:shadow-navy-900/5"
    >
      <span className="grid size-12 place-items-center rounded-xl bg-navy-50 text-navy-700 transition-colors group-hover:bg-navy-700 group-hover:text-white">
        <ServiceIcon name={service.icon} className="size-6" />
      </span>
      <h3 className="mt-5 text-2xl font-bold text-navy-900">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{service.summary}</p>
      <div className="mt-5 flex items-center justify-between">
        {service.price_from ? (
          <span className="text-sm text-muted">
            From <strong className="font-display text-xl text-brand-red">{formatPrice(service.price_from)}</strong>
          </span>
        ) : (
          <span className="text-sm font-medium text-muted">{service.icon === "gift" ? "Learn more" : "Ask for a quote"}</span>
        )}
        <ArrowRight className="size-5 text-navy-700 transition-transform group-hover:translate-x-1" aria-hidden />
      </div>
    </Link>
  );
}
