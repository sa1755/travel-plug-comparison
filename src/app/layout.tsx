import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { createPageMetadata, siteConfig } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.origin),
  ...createPageMetadata({
    title: "TravelPlug — Travel power made simple",
    description: siteConfig.description,
    path: "/",
  }),
  title: {
    default: "TravelPlug — Travel power made simple",
    template: "%s | TravelPlug",
  },
  applicationName: "TravelPlug",
  creator: "TravelPlug",
  publisher: "TravelPlug",
  category: "travel",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f4efe6",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
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
      </body>
    </html>
  );
}
