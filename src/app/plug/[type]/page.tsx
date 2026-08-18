import { ArrowRight, CircleDot, Earth, GitBranch, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PlugIllustration } from "@/components/comparison/plug-illustration";
import { createPageMetadata } from "@/lib/site-config";
import { getCountriesUsingPlug, getPlugBySlug, getPlugStaticParams } from "@/services/plug-service";

interface PlugPageProps {
  readonly params: Promise<{ type: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return [...getPlugStaticParams()];
}

export async function generateMetadata({ params }: PlugPageProps): Promise<Metadata> {
  const plug = getPlugBySlug((await params).type);
  if (!plug) return { title: "Plug guide not found" };
  const title = `${plug.name} Plug Guide and Countries`;
  const description = `${plug.description} See technical details and catalog countries that use ${plug.name}.`;
  return createPageMetadata({
    title,
    description,
    path: `/plug/${plug.slug}`,
    type: "article",
  });
}

export default async function PlugPage({ params }: PlugPageProps) {
  const plug = getPlugBySlug((await params).type);
  if (!plug) notFound();
  const countries = getCountriesUsingPlug(plug.type);

  const facts = [
    { icon: CircleDot, label: "Pins", value: plug.pinCounts.join(" or ") },
    { icon: GitBranch, label: "Pin shape", value: plug.pinShape },
    { icon: Earth, label: "Grounding", value: plug.grounding },
    { icon: Zap, label: "Typical current", value: `${plug.typicalCurrentAmps.join("/")} A` },
  ] as const;

  return (
    <>
      <section className="border-b border-border/70 bg-background">
        <div className="page-container grid gap-10 py-14 md:grid-cols-[1fr_0.75fr] md:items-center lg:py-20">
          <div className="max-w-2xl">
            <p className="section-label">International plug guide</p>
            <h1 className="mt-3 text-5xl font-bold tracking-[-0.045em] sm:text-7xl">{plug.name}</h1>
            <p className="mt-5 text-lg leading-8 text-muted">{plug.description}</p>
            <p className="mt-6 inline-flex rounded-full bg-brand-soft px-4 py-2 text-sm font-bold text-brand-strong">Standard: {plug.technicalStandard}</p>
            <div className="mt-7">
              <Link href="/#compare" className="inline-flex min-h-12 items-center rounded-full bg-brand px-5 font-bold text-white hover:bg-brand-strong">See if your plug will fit</Link>
            </div>
          </div>
          <div className="flex justify-center rounded-[2rem] border bg-surface-muted p-6">
            <PlugIllustration type={plug.type} className="size-64 max-w-full" />
          </div>
        </div>
      </section>

      <section className="page-container py-14 sm:py-20" aria-labelledby="technical-facts">
        <p className="section-label">Technical information</p>
        <h2 id="technical-facts" className="mt-2 text-3xl font-bold tracking-tight">The essentials</h2>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-3xl border bg-surface p-6">
              <Icon className="size-5 text-brand" aria-hidden="true" />
              <dt className="mt-5 text-sm font-medium text-muted">{label}</dt>
              <dd className="mt-1 text-lg font-bold capitalize">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5 rounded-2xl bg-warning-soft/60 p-5 text-sm leading-6 text-warning">
          Plug shape alone does not establish voltage compatibility. Check the local supply and the rating label on your exact device.
        </div>
        <p className="mt-6 text-sm leading-6 text-muted">Technical record reviewed August 2026. See the <Link href="/about#data-sources" className="font-semibold text-brand-strong underline">sources, methodology, and limitations</Link>. Socket designs and accepted plug variants can differ.</p>
      </section>

      <section className="border-t border-border/70 bg-surface-muted">
        <div className="page-container py-14 sm:py-20">
          <p className="section-label">Where it is used</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Catalog countries using {plug.name}</h2>
          {countries.length ? (
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {countries.map((country) => (
                <Link key={country.code} href={`/country/${country.slug}`} className="group flex min-h-20 items-center justify-between rounded-2xl border bg-surface px-5 hover:border-brand/30">
                  <span><span aria-hidden="true" className="mr-2 text-xl">{country.flag}</span><span className="font-semibold">{country.name}</span></span>
                  <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border bg-surface p-6">
              <p className="font-semibold">This plug is not used by an initial catalog country yet.</p>
              <Link href="/" className="mt-3 inline-flex min-h-11 items-center font-semibold text-brand-strong">Start a country comparison →</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
