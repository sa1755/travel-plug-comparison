import type { Metadata } from "next";

const fallbackOrigin = "https://travel-plug-comparison.vercel.app";

const normalizeOrigin = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return undefined;
  }
};

export const siteConfig = {
  name: "TravelPlug",
  description: "Compare plugs, sockets, voltage, and device compatibility before you travel.",
  origin:
    normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL) ??
    normalizeOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    fallbackOrigin,
} as const;

interface PageMetadataOptions {
  readonly title: string;
  readonly description: string;
  readonly path: `/${string}` | "/";
  readonly type?: "website" | "article";
}

export function createPageMetadata({
  title,
  description,
  path,
  type = "website",
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      type,
      locale: "en_GB",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "TravelPlug — clear international plug and power guidance",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}
