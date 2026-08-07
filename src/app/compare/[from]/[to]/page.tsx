import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TravelPlugJourney } from "@/components/comparison/travel-plug-journey";
import { createPageMetadata } from "@/lib/site-config";
import { getComparisonStaticParams, getCountries, getCountryBySlug } from "@/services/country-service";
import { getFeaturedDeviceProfiles } from "@/services/device-service";

interface ComparePageProps {
  readonly params: Promise<{ from: string; to: string }>;
}

export const dynamicParams = true;

export function generateStaticParams() {
  return [...getComparisonStaticParams()];
}

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const { from, to } = await params;
  const origin = getCountryBySlug(from);
  const destination = getCountryBySlug(to);
  if (!origin || !destination || origin.code === destination.code) return { title: "Comparison not found" };
  return createPageMetadata({
    title: `${origin.name} to ${destination.name} Plug Guide`,
    description: `See the plug types and power compatibility for travel from ${origin.name} to ${destination.name}.`,
    path: `/compare/${origin.slug}/${destination.slug}`,
    type: "article",
  });
}

export default async function ComparePage({ params }: ComparePageProps) {
  const { from, to } = await params;
  const origin = getCountryBySlug(from);
  const destination = getCountryBySlug(to);
  if (!origin || !destination || origin.code === destination.code) notFound();

  const countries = getCountries().map((country) => ({
    name: country.name, slug: country.slug, code: country.code,
    numericCode: country.numericCode, flag: country.flag,
    plugTypes: country.plugTypes, voltages: country.voltages,
    frequencies: country.frequencies, coordinates: country.coordinates,
    aliases: country.aliases,
  }));

  return (
    <TravelPlugJourney
      key={`${origin.slug}-${destination.slug}`}
      countries={countries}
      devices={getFeaturedDeviceProfiles()}
      initialFrom={origin.slug}
      initialTo={destination.slug}
      mode="result"
    />
  );
}
