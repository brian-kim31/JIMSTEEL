/** Public URL of the site, without a trailing slash (tolerates "https://x.app/" in env). */
export const SITE_URL = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
