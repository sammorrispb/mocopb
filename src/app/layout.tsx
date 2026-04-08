import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ScrollDepthTracker } from "@/components/ScrollDepthTracker";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/constants";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_TITLE} | Courts, Groups & Players`,
    template: `%s | MoCo PB`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "pickleball montgomery county md",
    "moco pickleball",
    "pickleball courts montgomery county",
    "where to play pickleball montgomery county",
    "pickleball groups montgomery county",
    "find pickleball players near me",
    "pickleball community maryland",
    "indoor pickleball montgomery county",
    "outdoor pickleball courts moco",
    "pickleball leagues montgomery county",
    "pickleball rockville md",
    "pickleball bethesda md",
    "pickleball olney md",
    "pickleball germantown md",
    "pickleball silver spring md",
    "pickleball wheaton md",
    "dmv pickleball",
    "pickleball dc maryland virginia",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "MoCo PB",
    title: `${SITE_TITLE} — Courts, Groups & Players`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Montgomery County Pickleball Community",
              alternateName: "MoCo PB",
              url: SITE_URL,
              description: SITE_DESCRIPTION,
              areaServed: {
                "@type": "AdministrativeArea",
                name: "Montgomery County, Maryland",
              },
            }),
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-court-green focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>
        <Nav />
        <main id="main-content" className="pt-16">
          {children}
        </main>
        <Footer />
        <StickyMobileCTA />
        <ScrollDepthTracker />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
