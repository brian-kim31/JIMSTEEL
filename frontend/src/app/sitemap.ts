import type { MetadataRoute } from "next";
import { getServices } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL ?? "http://localhost:3000";
  const services = await getServices();
  const pages = ["", "/about", "/services", "/book", "/service-history", "/contact", "/cookie-policy"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}` })),
    ...services.map((s) => ({ url: `${base}/services/${s.slug}` })),
  ];
}
