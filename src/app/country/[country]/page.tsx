import { ArrowRight, Gauge, Info, PlugZap, Radio } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PlugIllustration } from "@/components/comparison/plug-illustration";
import { createPageMetadata } from "@/lib/site-config";
import {
  getCountriesWithCompatiblePower,
  getCountryBySlug,
  getCountryStaticParams,
} from "@/services/country-service";
import { requirePlug } from "@/services/plug-service";
import { formatElectricalValues } from "@/utils/format-electrical-values";

interface CountryPageProps {
  readonly params: Promise<{ country: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return [...getCountryStaticParams()];
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const country = getCountryBySlug((await params).country);
  if (!country) return { title: "Country guide not found" };
  const title = `${country.name} Plugs, Voltage and Travel Guide`;
  const description = `See the plug types, nominal voltage, frequency, and practical electrical travel advice for ${country.name}.`;
  return createPageMetadata({
    title,
    description,
    path: `/country/${country.slug}`,
    type: "article",
  });
}

export default async function CountryPage({ params }: CountryPageProps) {
  const country = getCountryBySlug((await params).country);
  if (!country) notFound();

  const plugs = country.plugTypes.map(requirePlug);
  const compatibleCountries = getCountriesWithCompatiblePower(country);

  return (
    <>
      <section className="border-b border-border/70 bg-background">
        <div className="page-container grid gap-10 py-14 lg:grid-cols-[1fr_auto] lg:items-center lg:py-20">
          <div className="max-w-3xl">
            <p className="section-label">Country power guide</p>
            <h1 className="mt-3 text-balance text-4xl font-bold tracking-[-0.04em] sm:text-6xl">
              <span aria-hidden="true">{country.flag}</span> Power sockets in {country.name}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{country.travelAdvice}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/?to=${country.slug}#compare`} className="inline-flex min-h-12 items-center rounded-full bg-brand px-5 font-bold text-white hover:bg-brand-strong">Will my devices work here?</Link>
              <Link href={`/device-checker?to=${country.slug}`} className="inline-flex min-h-12 items-center rounded-full border border-border-strong bg-surface px-5 font-bold text-brand-strong">Check a specific device</Link>
            </div>
          </div>
          <div className="flex -space-x-10" aria-label={`Plug types used in ${country.name}`}>
            {plugs.map((plug) => (
              <PlugIllustration key={plug.type} type={plug.type} className="size-32 sm:size-40" />
            ))}
          </div>
        </div>
      </section>

      <section className="page-container py-14 sm:py-20" aria-labelledby="power-facts">
        <p className="section-label">At a glance</p>
        <h2 id="power-facts" className="mt-2 text-3xl font-bold tracking-tight">Power facts</h2>
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon: PlugZap, label: "Socket types", value: country.plugTypes.map((type) => `Type ${type}`).join(", ") },
            { icon: Gauge, label: "Nominal voltage", value: formatElectricalValues(country.voltages, "V") },
            { icon: Radio, label: "Frequency", value: formatElectricalValues(country.frequencies, "Hz") },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-3xl border bg-surface p-6">
              <Icon className="size-5 text-brand" aria-hidden="true" />
              <dt className="mt-5 text-sm font-medium text-muted">{label}</dt>
              <dd className="mt-1 text-xl font-bold">{value}</dd>
            </div>
          ))}
        </dl>
        {country.powerNote ? (
          <div className="mt-5 flex gap-3 rounded-2xl border border-warning/20 bg-warning-soft/60 p-5 text-sm leading-6 text-warning">
            <Info className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <p><strong>Local variation:</strong> {country.powerNote}</p>
          </div>
        ) : null}
      </section>

      <section className="border-y border-border/70 bg-surface-muted">
        <div className="page-container py-14 sm:py-20">
          <p className="section-label">Plug details</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Sockets you may encounter</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {plugs.map((plug) => (
              <Link key={plug.type} href={`/plug/${plug.slug}`} className="group rounded-3xl border bg-surface p-6 transition-[border-color,box-shadow] hover:border-brand/30 hover:shadow-card">
                <PlugIllustration type={plug.type} className="mx-auto size-36" />
                <h3 className="mt-4 text-xl font-bold">{plug.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{plug.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-semibold text-brand-strong">Open plug guide <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="page-container py-14 sm:py-20" aria-labelledby="compatible-countries">
        <p className="section-label">Plan another journey</p>
        <h2 id="compatible-countries" className="mt-2 text-3xl font-bold tracking-tight">Countries with a compatible power system</h2>
        <p className="mt-3 max-w-2xl leading-7 text-muted">These catalog countries have compatible plugs and matching nominal voltage and frequency. Your exact device label still takes priority.</p>
        {compatibleCountries.length ? (
          <>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {compatibleCountries.slice(0, 12).map((destination) => (
                <Link key={destination.code} href={`/compare/${country.slug}/${destination.slug}`} className="flex min-h-16 items-center justify-between rounded-2xl border bg-surface px-5 font-semibold hover:border-brand/30">
                  <span><span aria-hidden="true">{destination.flag}</span> {destination.name}</span>
                  <ArrowRight className="size-4 text-brand" aria-hidden="true" />
                </Link>
              ))}
            </div>
            {compatibleCountries.length > 12 ? <p className="mt-5 text-sm text-muted">Showing 12 close matches. Use global search to open any country guide.</p> : null}
          </>
        ) : (
          <div className="mt-8 rounded-3xl border bg-surface p-6">
            <p className="font-semibold">No full match exists in the current catalog.</p>
            <Link href="/" className="mt-3 inline-flex min-h-11 items-center text-brand-strong font-semibold">Compare a specific journey instead →</Link>
          </div>
        )}
      </section>
    </>
  );
}
