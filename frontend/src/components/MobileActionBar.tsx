import Link from "next/link";
import { CalendarCheck, Phone } from "lucide-react";
import { getSite } from "@/lib/api";
import { telHref } from "@/lib/format";

/** Sticky call/book bar on small screens – the two things most visitors want. */
export async function MobileActionBar() {
  const site = await getSite();
  const phone = site?.phone ?? "0115 922 7805";
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2 border-t border-line bg-white/95 p-3 backdrop-blur lg:hidden">
      <a
        href={telHref(phone)}
        className="flex items-center justify-center gap-2 rounded-xl bg-navy-700 py-3 font-semibold text-white"
      >
        <Phone className="size-4" aria-hidden /> Call
      </a>
      <Link
        href="/book"
        className="flex items-center justify-center gap-2 rounded-xl bg-brand-red py-3 font-semibold text-white"
      >
        <CalendarCheck className="size-4" aria-hidden /> Book online
      </Link>
    </div>
  );
}
