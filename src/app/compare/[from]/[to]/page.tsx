import type { Metadata } from "next";
import { Activity, ArrowRight, Gauge, Info, PlugZap } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ComparisonForm } from "@/components/comparison/comparison-form";
import { CompatibilityBadge } from "@/components/comparison/compatibility-badge";
import { ComparisonCard } from "@/components/comparison/comparison-card";
import { PlugCard } from "@/components/comparison/plug-card";
import { DeviceCard } from "@/components/device/device-card";
import { compareCountries } from "@/lib/comparison";
import { createPageMetadata } from "@/lib/site-config";
import {
  getComparisonStaticParams,
  getCountries,
  getCountryBySlug,
} from "@/services/country-service";
import { getDeviceProfiles } from "@/services/device-service";
import { requirePlug } from "@/services/plug-service";
import { formatElectricalValues } from "@/utils/format-electrical-values";

interface ComparePageProps {
  readonly params: Promise<{
    from: string;
    to: string;
  }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return [...getComparisonStaticParams()];
}

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const { from: fromSlug, to: toSlug } = await params;
  const origin = getCountryBySlug(fromSlug);
  const destination = getCountryBySlug(toSlug);

  if (!origin || !destination || origin.code === destination.code) {
    return { title: "Comparison not found" };
  }

  const title = `${origin.name} to ${destination.name} Plug Adapter Guide`;
  const description = `Compare plugs, voltage, frequency, and device guidance for travel from ${origin.name} to ${destination.name}.`;

  return createPageMetadata({
    title,
    description,
    path: `/compare/${origin.slug}/${destination.slug}`,
    type: "article",
  });
}

export default async function ComparePage({ params }: ComparePageProps) {
  const { from: fromSlug, to: toSlug } = await params;
  const origin = getCountryBySlug(fromSlug);
  const destination = getCountryBySlug(toSlug);

  if (!origin || !destination || origin.code === destination.code) {
    notFound();
  }

  const devices = getDeviceProfiles();
  const result = compareCountries(origin, destination, devices);
  const countryOptions = getCountries().map(({ name, slug, flag }) => ({ name, slug, flag }));
  const originPlugs = origin.plugTypes.map((type) => requirePlug(type));
  const destinationPlugs = destination.plugTypes.map((type) => requirePlug(type));

  return (
    <>
      <section className="border-b border-border/70 bg-surface-muted">
        <div className="page-container py-10 sm:py-14">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-brand-strong hover:bg-brand-soft"
          >
            ← Start a new comparison
          </Link>

          <div className="mt-6 rounded-[2rem] border border-border/80 bg-surface p-6 shadow-card sm:p-9">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="section-label">Your travel power guide</p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  <span>
                    <span aria-hidden="true">{origin.flag}</span> {origin.name}
                  </span>
                  <ArrowRight className="size-6 text-brand" aria-hidden="true" />
                  <span>
                    <span aria-hidden="true">{destination.flag}</span> {destination.name}
                  </span>
                </div>
              </div>
              <CompatibilityBadge level={result.level} />
            </div>

            <h1 className="mt-8 max-w-3xl text-balance text-3xl font-bold tracking-[-0.035em] sm:text-5xl">
              {result.plug.title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">{result.summary}</p>

            <div className="mt-7 flex gap-3 rounded-2xl bg-brand-faint p-4 text-sm leading-6 text-brand-strong">
              <Info className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <p>
                A travel adapter changes plug shape, not voltage. Always read the input
                rating on the exact device and use a properly certified adapter or
                converter.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container py-14 sm:py-20" aria-labelledby="compatibility-details">
        <div className="max-w-3xl">
          <p className="section-label">Compatibility details</p>
          <h2
            id="compatibility-details"
            className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            What changes on this journey
          </h2>
        </div>

        <div className="mt-9 grid gap-5 lg:grid-cols-3">
          <ComparisonCard
            icon={<PlugZap className="size-5" aria-hidden="true" />}
            eyebrow="Plug and socket"
            title={result.plug.title}
            summary={result.plug.summary}
            level={result.plug.level}
          >
            <dl className="grid gap-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">From</dt>
                <dd className="font-bold">Types {origin.plugTypes.join(", ")}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Destination</dt>
                <dd className="font-bold">Types {destination.plugTypes.join(", ")}</dd>
              </div>
            </dl>
          </ComparisonCard>

          <ComparisonCard
            icon={<Gauge className="size-5" aria-hidden="true" />}
            eyebrow="Voltage"
            title={result.voltage.title}
            summary={result.voltage.summary}
            level={result.voltage.level}
          >
            <dl className="grid gap-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">From</dt>
                <dd className="font-bold">
                  {formatElectricalValues(origin.voltages, "V")}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Destination</dt>
                <dd className="font-bold">
                  {formatElectricalValues(destination.voltages, "V")}
                </dd>
              </div>
            </dl>
          </ComparisonCard>

          <ComparisonCard
            icon={<Activity className="size-5" aria-hidden="true" />}
            eyebrow="Frequency"
            title={result.frequency.title}
            summary={result.frequency.summary}
            level={result.frequency.level}
          >
            <dl className="grid gap-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">From</dt>
                <dd className="font-bold">
                  {formatElectricalValues(origin.frequencies, "Hz")}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Destination</dt>
                <dd className="font-bold">
                  {formatElectricalValues(destination.frequencies, "Hz")}
                </dd>
              </div>
            </dl>
          </ComparisonCard>
        </div>

        {origin.powerNote || destination.powerNote ? (
          <div className="mt-5 rounded-2xl border border-warning/20 bg-warning-soft/60 p-5 text-sm leading-6 text-warning">
            <p className="font-bold">Local power note</p>
            {origin.powerNote ? <p className="mt-1">{origin.name}: {origin.powerNote}</p> : null}
            {destination.powerNote ? (
              <p className="mt-1">{destination.name}: {destination.powerNote}</p>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="border-y border-border/70 bg-surface-muted">
        <div className="page-container py-14 sm:py-20">
          <div className="max-w-3xl">
            <p className="section-label">Socket guide</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              The plug types side by side
            </h2>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-2">
            <PlugCard countryName={origin.name} flag={origin.flag} plugs={originPlugs} />
            <PlugCard
              countryName={destination.name}
              flag={destination.flag}
              plugs={destinationPlugs}
            />
          </div>
        </div>
      </section>

      <section className="page-container py-14 sm:py-20" aria-labelledby="device-guidance">
        <div className="max-w-3xl">
          <p className="section-label">Device guidance</p>
          <h2 id="device-guidance" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Check the devices in your bag
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted">
            These are general profiles. The rating label and manufacturer instructions
            for your exact model are always the final authority.
          </p>
        </div>
        <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {result.devices.map((device) => (
            <DeviceCard key={device.deviceId} result={device} />
          ))}
        </div>
      </section>

      <section className="border-t border-border/70 bg-surface-muted">
        <div className="page-container grid gap-8 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:py-20">
          <div>
            <p className="section-label">Another journey?</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Change your trip</h2>
            <p className="mt-3 leading-7 text-muted">
              Swap the route or choose two new countries to create another guide.
            </p>
          </div>
          <div className="rounded-3xl border border-border/80 bg-surface p-6 shadow-card sm:p-8">
            <ComparisonForm
              countries={countryOptions}
              defaultFrom={origin.slug}
              defaultTo={destination.slug}
              submitLabel="Update comparison"
            />
          </div>
        </div>
      </section>
    </>
  );
}
