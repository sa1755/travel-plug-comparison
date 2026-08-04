import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import "./globals.css";

const siteDescription =
  "Compare plugs, sockets, voltage, and device compatibility before you travel.";

export const metadata: Metadata = {
  title: {
    default: "TravelPlug — Travel power made simple",
    template: "%s | TravelPlug",
  },
  description: siteDescription,
  applicationName: "TravelPlug",
  openGraph: {
    type: "website",
    siteName: "TravelPlug",
    title: "TravelPlug — Travel power made simple",
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "TravelPlug — Travel power made simple",
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f7f9f6",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
