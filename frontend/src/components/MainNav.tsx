"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarCheck, ChevronDown, Menu, Phone, X } from "lucide-react";
import { ServiceIcon } from "./ServiceIcon";
import { telHref } from "@/lib/format";

type NavService = { slug: string; title: string; icon: string };

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/service-history", label: "Service History" },
  { href: "/contact", label: "Contact" },
];

function linkClass(active: boolean) {
  return `rounded-lg px-3 py-2 text-[15px] font-semibold transition-colors ${
    active ? "text-brand-red" : "text-navy-800 hover:bg-navy-50"
  }`;
}

export function MainNav({ services, phone }: { services: NavService[]; phone: string }) {
  const pathname = usePathname();
  // Menu is "open for this path" – navigating anywhere closes it without an effect.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const setOpen = (next: boolean) => setOpenPath(next ? pathname : null);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
        <Link href="/" className={linkClass(pathname === "/")}>
          Home
        </Link>
        <div className="group relative">
          <Link href="/services" className={`${linkClass(isActive("/services"))} inline-flex items-center gap-1`}>
            Services <ChevronDown className="size-4 transition-transform group-hover:rotate-180" aria-hidden />
          </Link>
          <div className="invisible absolute left-1/2 top-full w-72 -translate-x-1/2 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
            <ul className="rounded-2xl border border-line bg-white p-2 shadow-xl shadow-navy-900/10">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-navy-900 hover:bg-navy-50"
                  >
                    <ServiceIcon name={s.icon} className="size-5 text-brand-red" />
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={linkClass(isActive(l.href))}>
            {l.label}
          </Link>
        ))}
        <Link
          href="/book"
          className="ml-3 inline-flex items-center gap-2 rounded-lg bg-brand-red px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm hover:bg-brand-red-dark"
        >
          <CalendarCheck className="size-4" aria-hidden /> Book online
        </Link>
      </nav>

      <div className="flex items-center gap-2 lg:hidden">
        <a
          href={telHref(phone)}
          className="grid size-11 place-items-center rounded-lg bg-navy-50 text-navy-700"
          aria-label={`Call ${phone}`}
        >
          <Phone className="size-5" aria-hidden />
        </a>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="grid size-11 place-items-center rounded-lg bg-navy-700 text-white"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-18 z-50 overflow-y-auto bg-white lg:hidden">
          <nav aria-label="Mobile" className="space-y-1 p-4">
            <Link href="/" className="block rounded-xl px-4 py-3 text-lg font-semibold text-navy-900 hover:bg-navy-50">
              Home
            </Link>
            <p className="px-4 pb-1 pt-4 text-xs font-bold uppercase tracking-widest text-muted">Services</p>
            <div className="grid grid-cols-2 gap-2">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="flex items-center gap-2 rounded-xl bg-surface px-3 py-3 text-sm font-semibold text-navy-900"
                >
                  <ServiceIcon name={s.icon} className="size-5 shrink-0 text-brand-red" />
                  {s.title}
                </Link>
              ))}
            </div>
            <div className="pt-3">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block rounded-xl px-4 py-3 text-lg font-semibold text-navy-900 hover:bg-navy-50"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4">
              <a href={telHref(phone)} className="rounded-xl bg-navy-700 py-3.5 text-center font-semibold text-white">
                Call us
              </a>
              <Link href="/book" className="rounded-xl bg-brand-red py-3.5 text-center font-semibold text-white">
                Book online
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

export function MainNavFallback() {
  return <div className="h-11 w-11 lg:w-[560px]" aria-hidden />;
};
