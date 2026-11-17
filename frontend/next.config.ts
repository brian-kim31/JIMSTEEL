import type { NextConfig } from "next";

const apiUrl = new URL(process.env.API_URL ?? "http://localhost:8000");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: "/media/**",
      },
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
    ],
    // Only needed when the Django API (and its /media) is on this machine, e.g. local dev/preview.
    dangerouslyAllowLocalIP: ["localhost", "127.0.0.1"].includes(apiUrl.hostname),
  },
  // Keep old Joomla URLs (Google results, bookmarks, printed material) working.
  async redirects() {
    const old = "/site/index.php";
    return [
      { source: "/site", destination: "/", permanent: true },
      { source: old, destination: "/", permanent: true },
      { source: `${old}/about-us`, destination: "/about", permanent: true },
      { source: `${old}/what-we-do`, destination: "/services", permanent: true },
      { source: `${old}/what-we-do/mots`, destination: "/services/mot", permanent: true },
      { source: `${old}/what-we-do/:slug`, destination: "/services/:slug", permanent: true },
      { source: `${old}/book-now`, destination: "/book", permanent: true },
      { source: `${old}/service-history`, destination: "/service-history", permanent: true },
      { source: `${old}/reviews`, destination: "/#reviews", permanent: true },
      { source: `${old}/contact`, destination: "/contact", permanent: true },
      { source: `${old}/cookie-policy`, destination: "/cookie-policy", permanent: true },
    ];
  },
};

export default nextConfig;
