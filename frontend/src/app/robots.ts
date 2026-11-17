import { PREVIEW_MODE, SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = SITE_URL;
  if (PREVIEW_MODE) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${base}/sitemap.xml` };
}
