import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { createPageMetadata, siteConfig } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.origin),
  ...createPageMetadata({
    title: "Does your charger work abroad? | TravelPlug",
    description: siteConfig.description,
    path: "/",
  }),
  title: {
    default: "Does your charger work abroad? | TravelPlug",
    template: "%s | TravelPlug",
  },
  applicationName: "TravelPlug",
  creator: "TravelPlug",
  publisher: "TravelPlug",
  category: "travel",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4efe6" },
    { media: "(prefers-color-scheme: dark)", color: "#181613" },
  ],
};

const themeInitializationScript = `
  (() => {
    try {
      const saved = localStorage.getItem("travelplug-theme");
      const theme = saved === "light" || saved === "dark"
        ? saved
        : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch {}
  })();
`;

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.origin,
    description: siteConfig.description,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#main-content"
          className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-xl bg-brand px-4 py-3 font-bold text-white transition-transform focus:translate-y-0 motion-reduce:transition-none"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1" tabIndex={-1}>{children}</main>
        <Footer />
        <AnalyticsProvider />
      </body>
    </html>
  );
}
