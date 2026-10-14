import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource-variable/bricolage-grotesque";
import "@/styles/globals.css";
import { StarDefs, themeInitScript } from "@/components/ui";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CompareTray } from "@/components/shortlist/ShortlistControls";
import { getCollegeIndex } from "@/lib/api";
import { SITE } from "@/lib/site";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — Colleges, courses, exams and one-form applications`, template: `%s · ${SITE.name}` },
  description: "Compare 38,000+ Indian colleges on fees, placements and fee payback, check cutoffs with free predictors, and apply to several colleges with one form.",
  applicationName: SITE.name,
  openGraph: { type: "website", siteName: SITE.name, locale: SITE.locale },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
    { media: "(prefers-color-scheme: light)", color: "#f7f7f8" },
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const index = await getCollegeIndex();
  const names = Object.fromEntries(index.map((c) => [c.slug, c.name]));
  return (
    <html lang="en-IN" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <StarDefs />
        <Providers>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CompareTray names={names} />
        </Providers>
      </body>
    </html>
  );
}
