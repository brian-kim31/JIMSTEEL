import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getServices, getSite } from "@/lib/api";
import { telHref } from "@/lib/format";
import { Container } from "./ui";

function Social({ href, label, path }: { href: string; label: string; path: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid size-10 place-items-center rounded-lg bg-white/10 text-white transition-colors hover:bg-brand-red"
    >
      <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden>
        <path d={path} />
      </svg>
    </a>
  );
}

const ICON_PATHS = {
  facebook:
    "M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.33-.04-1.57-.14-2.88-.14C11.9 2 10 3.66 10 6.7v2.8H7v4h3V22h4v-8.5z",
  x: "M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3zm-1.08 16.17h1.7L7.4 4.74H5.58l11.09 14.43z",
  linkedin:
    "M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z",
};

export async function Footer() {
  "use cache";
  cacheLife("hours");
  cacheTag("content");
  const [site, services] = await Promise.all([getSite(), getServices()]);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 pb-24 text-navy-100 lg:pb-0">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-bold text-white">{site?.business_name ?? "Jim Steel Garage Services"}</p>
          {site?.motto && <p className="mt-3 text-sm italic text-navy-200">“{site.motto}”</p>}
          <p className="mt-3 text-sm">Family-run since {site?.established_year ?? 1982}.</p>
          <div className="mt-5 flex gap-2">
            {site?.facebook_url && <Social href={site.facebook_url} label="Facebook" path={ICON_PATHS.facebook} />}
            {site?.x_url && <Social href={site.x_url} label="X (Twitter)" path={ICON_PATHS.x} />}
            {site?.linkedin_url && <Social href={site.linkedin_url} label="LinkedIn" path={ICON_PATHS.linkedin} />}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Services</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="hover:text-white">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Visit us</h2>
          {site && (
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin className="size-5 shrink-0 text-red-300" aria-hidden />
                <address className="not-italic">
                  {site.address_line1}
                  <br />
                  {site.town}, {site.county}
                  <br />
                  {site.postcode}
                </address>
              </li>
              <li className="flex gap-3">
                <Phone className="size-5 shrink-0 text-red-300" aria-hidden />
                <a href={telHref(site.phone)} className="hover:text-white">
                  {site.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="size-5 shrink-0 text-red-300" aria-hidden />
                <a href={`mailto:${site.email}`} className="break-all hover:text-white">
                  {site.email}
                </a>
              </li>
            </ul>
          )}
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Opening hours</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {site?.opening_hours.map((h) => (
              <li key={h} className="flex gap-3">
                <Clock className="size-5 shrink-0 text-red-300" aria-hidden />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-6 text-xs text-navy-200 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site?.business_name ?? "Jim Steel Garage Services"}. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex gap-5">
            {site?.privacy_policy && (
              <a href={site.privacy_policy} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Privacy policy
              </a>
            )}
            <Link href="/cookie-policy" className="hover:text-white">
              Cookie policy
            </Link>
          </nav>
        </Container>
      </div>
    </footer>
  );
}
