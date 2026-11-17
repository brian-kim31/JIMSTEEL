import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Clock, Mail, Phone } from "lucide-react";
import { getServices, getSite } from "@/lib/api";
import { telHref } from "@/lib/format";
import { Container } from "./ui";
import { MainNav, MainNavFallback } from "./MainNav";

export async function Header() {
  const [site, services] = await Promise.all([getSite(), getServices()]);
  const phone = site?.phone ?? "0115 922 7805";
  const navServices = services.map((s) => ({ slug: s.slug, title: s.title, icon: s.icon }));

  return (
    <header className="sticky top-0 z-40 bg-white/95 shadow-[0_1px_0_var(--color-line)] backdrop-blur">
      <div className="hidden bg-navy-900 text-sm text-navy-100 md:block">
        <Container className="flex h-10 items-center justify-between">
          <p className="flex items-center gap-2">
            <Clock className="size-4 text-red-300" aria-hidden />
            {site?.opening_hours.slice(0, 2).join(" · ")}
          </p>
          <div className="flex items-center gap-6">
            {site?.email && (
              <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-white">
                <Mail className="size-4 text-red-300" aria-hidden />
                {site.email}
              </a>
            )}
            <a href={telHref(phone)} className="flex items-center gap-2 font-semibold text-white">
              <Phone className="size-4 text-red-300" aria-hidden />
              {phone}
            </a>
          </div>
        </Container>
      </div>
      <Container className="flex h-18 items-center justify-between gap-4 lg:h-20">
        <Link href="/" className="shrink-0" aria-label={`${site?.business_name ?? "Jim Steel Garage Services"} – home`}>
          {site?.logo ? (
            <Image src={site.logo} alt="" width={675} height={184} priority className="h-11 w-auto lg:h-14" />
          ) : (
            <span className="font-display text-2xl font-bold text-navy-700">Jim Steel</span>
          )}
        </Link>
        <Suspense fallback={<MainNavFallback />}>
          <MainNav services={navServices} phone={phone} />
        </Suspense>
      </Container>
    </header>
  );
}
