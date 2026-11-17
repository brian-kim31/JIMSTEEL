import { getSite } from "@/lib/api";
import { telHref } from "@/lib/format";

/** Makes clear this is an unofficial concept, and points real customers to the garage. */
export async function PreviewBanner() {
  const site = await getSite();
  const phone = site?.phone ?? "0115 922 7805";
  return (
    <div role="note" className="bg-amber-300 px-4 py-2 text-center text-sm text-amber-950">
      <strong className="font-semibold">Preview:</strong> a concept redesign, not the official Jim Steel Garage
      Services website. Forms here don’t reach the garage – to book, call{" "}
      <a href={telHref(phone)} className="font-semibold underline underline-offset-2">
        {phone}
      </a>
      .
    </div>
  );
}
