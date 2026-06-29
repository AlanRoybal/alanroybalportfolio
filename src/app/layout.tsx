import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ScrollReveal } from "@/components/providers/ScrollReveal";
import { Nav } from "@/components/chrome/Nav";
import { ScrollProgress } from "@/components/chrome/ScrollProgress";
import { SITE, jsonLd } from "@/lib/site";

// Display — high-contrast old-style serif with an optical-size axis. Used with
// restraint: hero + section heads.
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
});

// Body — humanist grotesque, calm and legible.
const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Mono — the HUD voice: micro-labels, spec sheets, the terminal cards.
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: "%s · Alan Roybal",
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "technology",
  applicationName: SITE.title,
  alternates: { canonical: SITE.url },
  // Set GOOGLE_SITE_VERIFICATION in Vercel env to verify Search Console
  // ownership (omitted from <head> when unset).
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "profile",
    url: SITE.url,
    siteName: SITE.title,
    title: SITE.title,
    description: SITE.shortDescription,
    locale: "en_US",
    firstName: "Alan",
    lastName: "Roybal",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.shortDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          // Structured data for search + answer engines (AEO).
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
        />
        <a
          href="#about"
          className="label sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[90] focus:rounded-[var(--radius-md)] focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
        >
          skip to content
        </a>
        <ScrollProgress />
        <Nav />
        <SmoothScroll>
          <ScrollReveal />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
