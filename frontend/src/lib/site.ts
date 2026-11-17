/** Public URL of the site, without a trailing slash (tolerates "https://x.app/" in env). */
export const SITE_URL = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

/**
 * Preview mode: shows the "concept redesign" banner and keeps search engines out.
 * On by default; set PREVIEW_MODE=off when the garage adopts the site and it goes live on their domain.
 */
export const PREVIEW_MODE = process.env.PREVIEW_MODE !== "off";
