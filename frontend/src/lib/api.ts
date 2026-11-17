import "server-only";
import { cacheLife, cacheTag } from "next/cache";

const API_URL = (process.env.API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export type SiteSettings = {
  business_name: string;
  tagline: string;
  motto: string;
  established_year: number;
  phone: string;
  email: string;
  address_line1: string;
  address_line2: string;
  town: string;
  county: string;
  postcode: string;
  opening_hours: string[];
  latitude: string | null;
  longitude: string | null;
  map_embed_url: string;
  google_reviews_url: string;
  facebook_url: string;
  x_url: string;
  linkedin_url: string;
  booking_url: string;
  service_history_url: string;
  privacy_policy: string | null;
  logo: string | null;
  icon: string | null;
  accreditations: { name: string; description: string }[];
};

export type Promotion = {
  id: number;
  title: string;
  price_label: string;
  blurb: string;
  link: string;
  image: string | null;
};

export type Video = { id: number; title: string; youtube_id: string; placement: string };

export type Section = {
  id: number;
  heading: string;
  body: string[];
  bullets: string[];
  style: "default" | "callout" | "tip" | "checklist";
  image?: string | null;
  image_alt?: string;
};

export type PricePackage = {
  id: number;
  name: string;
  price: string;
  price_prefix: string;
  description: string;
  includes: string[];
  note: string;
  is_featured: boolean;
};

export type ServiceSummary = {
  slug: string;
  title: string;
  headline: string;
  summary: string;
  icon: string;
  price_from: string | null;
  hero_image: string | null;
};

export type Service = ServiceSummary & { sections: Section[]; packages: PricePackage[] };

export type Page = { slug: string; title: string; headline: string; intro: string[]; sections: Section[] };

/** Fetch JSON from Django. Returns null on 404 or when the API is unreachable, so pages degrade gracefully. */
async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}/api${path}`, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      if (res.status !== 404) console.error(`[api] ${path} -> ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[api] ${path} unreachable:`, (err as Error).message);
    return null;
  }
}

export async function getSite() {
  "use cache";
  cacheLife("hours");
  cacheTag("content");
  return get<SiteSettings>("/site/");
}

export async function getServices() {
  "use cache";
  cacheLife("hours");
  cacheTag("content");
  return (await get<ServiceSummary[]>("/services/")) ?? [];
}

export async function getService(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("content");
  return get<Service>(`/services/${encodeURIComponent(slug)}/`);
}

export async function getPage(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("content");
  return get<Page>(`/pages/${encodeURIComponent(slug)}/`);
}

export async function getPromotions() {
  "use cache";
  cacheLife("hours");
  cacheTag("content");
  return (await get<Promotion[]>("/promotions/")) ?? [];
}

export async function getVideos(placement?: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("content");
  return (await get<Video[]>(`/videos/${placement ? `?placement=${placement}` : ""}`)) ?? [];
}

export { API_URL };
