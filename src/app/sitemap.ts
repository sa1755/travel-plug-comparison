import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";
import {
  getComparisonStaticParams,
  getCountryStaticParams,
} from "@/services/country-service";
import { getPlugStaticParams } from "@/services/plug-service";

const absoluteUrl = (path: string) => new URL(path, `${siteConfig.origin}/`).toString();

export default function sitemap(): MetadataRoute.Sitemap {
  const comparisons = getComparisonStaticParams().map(({ from, to }) => ({
    url: absoluteUrl(`/compare/${from}/${to}`),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));
  const countries = getCountryStaticParams().map(({ country }) => ({
    url: absoluteUrl(`/country/${country}`),
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));
  const plugs = getPlugStaticParams().map(({ type }) => ({
    url: absoluteUrl(`/plug/${type}`),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/device-checker"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.6 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.4 },
    ...countries,
    ...plugs,
    ...comparisons,
  ];
}
