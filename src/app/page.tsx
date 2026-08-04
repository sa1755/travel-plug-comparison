import {
  ArrowRight,
  BadgeCheck,
  CircleCheck,
  Gauge,
  Luggage,
  PlaneTakeoff,
  PlugZap,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { ComparisonForm } from "@/components/comparison/comparison-form";
import { getCountries, requireCountry } from "@/services/country-service";

const benefits = [
  {
    icon: PlugZap,
    step: "01",
    title: "Check the connection",
    description: "See whether your plug fits before an adapter reaches your packing list.",
  },
  {
    icon: Gauge,
    step: "02",
    title: "Understand the power",
    description: "Make sense of voltage and frequency differences in plain language.",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "Pack with confidence",
    description: "Know which everyday devices should work and which need a closer check.",
  },
] as const;

const popularRoutes = [
  ["united-kingdom", "japan"],
  ["united-states", "france"],
  ["australia", "thailand"],
  ["india", "singapore"],
] as const;

const travelTips = [
  {
    icon: BadgeCheck,
    title: "Read the input label",
    description: "Look for the destination voltage and frequency on the exact device or charger.",
  },
  {
    icon: ShieldCheck,
    title: "Choose a certified adapter",
    description: "Use a properly rated product from a reputable supplier, especially for grounded devices.",
  },
  {
    icon: Luggage,
    title: "Check before departure",
    description: "Adapters can be harder to find after arrival, and airport choices may be limited.",
  },
] as const;

export default function HomePage() {
  const countries = getCountries();
  const countryOptions = countries.map(({ name, slug, flag }) => ({ name, slug, flag }));

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border/70 bg-surface">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_18%,rgba(26,115,232,0.12),transparent_32%),radial-gradient(circle_at_9%_88%,rgba(232,240,254,0.8),transparent_28%)]"
        />
        <div className="page-container grid gap-14 py-16 sm:py-24 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-16 lg:py-28">
          <div className="max-w-3xl">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/15 bg-brand-faint px-3.5 py-1.5 text-sm font-semibold text-brand-strong">
              <PlaneTakeoff className="size-4" aria-hidden="true" />
              Clear answers for every journey
            </p>
            <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-[4.5rem]">
              Know what plug you need before you fly.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted sm:text-xl sm:leading-9">
              Compare sockets, voltage and device compatibility between countries.
              Get one clear answer, without the electrical jargon.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-muted">
              <span className="inline-flex items-center gap-2">
                <CircleCheck className="size-4.5 text-brand" aria-hidden="true" />
                17 travel destinations
              </span>
              <span className="inline-flex items-center gap-2">
                <CircleCheck className="size-4.5 text-brand" aria-hidden="true" />
                Device-specific guidance
              </span>
            </div>
          </div>

          <aside
            aria-labelledby="journey-card-title"
            className="rounded-[1.75rem] border border-border/80 bg-surface p-2 shadow-elevated"
          >
            <div className="rounded-[1.35rem] bg-brand px-6 py-6 text-white sm:px-7">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/75">
                Your journey
              </p>
              <h2 id="journey-card-title" className="mt-2 text-2xl font-bold tracking-tight">
                Compare two countries
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/80">
                Start with where your devices come from, then add your destination.
              </p>
            </div>
            <div className="p-5 sm:p-6">
              <ComparisonForm countries={countryOptions} />
            </div>
          </aside>
        </div>
      </section>

      <section
        id="how-it-works"
        aria-labelledby="how-it-works-title"
        className="page-container scroll-mt-24 py-16 sm:py-24"
      >
        <div className="max-w-3xl">
          <p className="section-label">How TravelPlug helps</p>
          <h2
            id="how-it-works-title"
            className="mt-3 text-balance text-3xl font-bold tracking-[-0.03em] sm:text-4xl sm:leading-tight"
          >
            Everything important. Nothing overwhelming.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
            TravelPlug turns technical power information into the practical choices
            you need to make before departure.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {benefits.map(({ icon: Icon, step, title, description }) => (
            <article
              key={title}
              className="rounded-3xl border border-border/90 bg-surface p-6 sm:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-bold text-muted">{step}</span>
              </div>
              <h3 className="mt-6 text-lg font-bold tracking-tight">{title}</h3>
              <p className="mt-2 leading-7 text-muted">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border/70 bg-surface-muted" aria-labelledby="adapter-title">
        <div className="page-container grid gap-10 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:py-24">
          <div className="flex aspect-square max-w-sm items-center justify-center rounded-[2rem] border border-brand/10 bg-surface shadow-card">
            <span className="flex size-28 items-center justify-center rounded-[2rem] bg-brand-soft text-brand-strong">
              <PlugZap className="size-14" strokeWidth={1.7} aria-hidden="true" />
            </span>
          </div>
          <div className="max-w-2xl">
            <p className="section-label">Why adapters matter</p>
            <h2 id="adapter-title" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Plug fit and electrical safety are two different questions.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted">
              An adapter changes the physical connection. It does not change voltage or
              frequency, so the device rating label still decides whether the device can
              be connected safely.
            </p>
            <ul className="mt-6 grid gap-3 text-sm font-semibold text-foreground sm:grid-cols-2">
              <li className="flex gap-2 rounded-2xl bg-surface p-4">
                <CircleCheck className="mt-0.5 size-4.5 shrink-0 text-brand" aria-hidden="true" />
                Adapter: changes plug shape
              </li>
              <li className="flex gap-2 rounded-2xl bg-surface p-4">
                <CircleCheck className="mt-0.5 size-4.5 shrink-0 text-brand" aria-hidden="true" />
                Converter: changes voltage
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="page-container py-16 sm:py-24" aria-labelledby="popular-routes-title">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="section-label">Popular destinations</p>
            <h2 id="popular-routes-title" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Start with a common journey
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted">
            Open a complete guide now, then change either country from the result page.
          </p>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          {popularRoutes.map(([fromSlug, toSlug]) => {
            const origin = requireCountry(fromSlug);
            const destination = requireCountry(toSlug);
            return (
              <Link
                key={`${fromSlug}-${toSlug}`}
                href={`/compare/${fromSlug}/${toSlug}`}
                className="group flex min-h-24 items-center justify-between gap-4 rounded-3xl border border-border/90 bg-surface p-5 transition-[border-color,box-shadow] hover:border-brand/30 hover:shadow-card"
              >
                <span>
                  <span className="block text-sm font-medium text-muted">Travel guide</span>
                  <span className="mt-1 block font-bold text-foreground">
                    <span aria-hidden="true">{origin.flag}</span> {origin.name}
                    <span className="mx-2 text-brand" aria-hidden="true">→</span>
                    <span aria-hidden="true">{destination.flag}</span> {destination.name}
                  </span>
                </span>
                <ArrowRight
                  className="size-5 shrink-0 text-brand transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border/70 bg-surface-muted" aria-labelledby="travel-tips-title">
        <div className="page-container py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="section-label">Travel tips</p>
            <h2 id="travel-tips-title" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Three checks before your bag closes
            </h2>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {travelTips.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-3xl border border-border/80 bg-surface p-6">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
