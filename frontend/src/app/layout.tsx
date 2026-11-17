import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { getSite } from "@/lib/api";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const barlow = Barlow_Condensed({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-barlow" });

import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Jim Steel Garage Services | Servicing, Repairs & MOTs in Beeston, Nottingham",
    template: "%s | Jim Steel Garage Services, Beeston",
  },
  description:
    "Family-run independent garage in Beeston, Nottingham since 1982. Servicing, MOTs, diagnostics, air conditioning and repairs for all makes – warranty safe.",
  openGraph: { type: "website", locale: "en_GB", siteName: "Jim Steel Garage Services" },
};

export const viewport: Viewport = { themeColor: "#2e3092" };

async function LocalBusinessJsonLd() {
  const site = await getSite();
  if (!site) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: site.business_name,
    url: SITE_URL,
    telephone: site.phone,
    email: site.email,
    foundingDate: String(site.established_year),
    image: site.logo ?? undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address_line1,
      addressLocality: site.town,
      addressRegion: site.county,
      postalCode: site.postcode,
      addressCountry: "GB",
    },
    geo: site.latitude ? { "@type": "GeoCoordinates", latitude: site.latitude, longitude: site.longitude } : undefined,
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "08:00", closes: "17:30" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "08:00", closes: "17:00" },
    ],
    sameAs: [site.facebook_url, site.x_url, site.linkedin_url].filter(Boolean),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${barlow.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-lg bg-navy-700 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <MobileActionBar />
        <LocalBusinessJsonLd />
      </body>
    </html>
  );
}
