import Link from "next/link";
import { Check } from "lucide-react";
import type { PricePackage } from "@/lib/api";
import { formatPrice } from "@/lib/format";

export function PriceCard({ pkg }: { pkg: PricePackage }) {
  const featured = pkg.is_featured;
  return (
    <article
      className={`relative flex flex-col rounded-2xl border p-6 ${
        featured ? "border-navy-700 bg-navy-900 text-white shadow-xl shadow-navy-900/20" : "border-line bg-white"
      }`}
    >
      {featured && (
        <span className="absolute -top-3 left-6 rounded-full bg-brand-red px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
          Most popular
        </span>
      )}
      <h3 className={`text-2xl font-bold ${featured ? "text-white" : "text-navy-800"}`}>{pkg.name}</h3>
      <p className="mt-3 flex items-baseline gap-2">
        {pkg.price_prefix && (
          <span className={`text-sm font-medium ${featured ? "text-navy-100" : "text-muted"}`}>{pkg.price_prefix}</span>
        )}
        <span className="font-display text-4xl font-bold">{formatPrice(pkg.price)}</span>
      </p>
      {pkg.description && (
        <p className={`mt-4 text-sm leading-relaxed ${featured ? "text-navy-100" : "text-muted"}`}>{pkg.description}</p>
      )}
      {pkg.includes.length > 0 && (
        <ul className="mt-5 space-y-2 text-sm">
          {pkg.includes.map((item) => (
            <li key={item} className="flex gap-2">
              <Check className={`size-4 shrink-0 translate-y-0.5 ${featured ? "text-red-300" : "text-brand-red"}`} aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      )}
      {pkg.note && (
        <p className={`mt-5 border-t pt-4 text-xs ${featured ? "border-white/15 text-navy-200" : "border-line text-muted"}`}>
          {pkg.note}
        </p>
      )}
      <div className="mt-auto pt-6">
        <Link
          href="/book"
          className={`block rounded-lg px-4 py-3 text-center text-sm font-semibold transition-colors ${
            featured ? "bg-brand-red text-white hover:bg-brand-red-dark" : "bg-navy-700 text-white hover:bg-navy-800"
          }`}
        >
          Book {pkg.name}
        </Link>
      </div>
    </article>
  );
}
