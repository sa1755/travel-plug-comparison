import type { Metadata } from "next";
import { Code2, Globe2, HeartHandshake } from "lucide-react";
import Link from "next/link";

import { TrackedExternalLink } from "@/components/analytics/tracked-external-link";
import { createPageMetadata } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({
  title: "About TravelPlug",
  description: "Learn how TravelPlug makes international plug, voltage, and device guidance clearer for travellers.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <section className="page-container py-14 sm:py-20">
      <div className="max-w-3xl">
        <p className="section-label">About TravelPlug</p>
        <h1 className="mt-3 text-balance text-4xl font-bold tracking-[-0.04em] sm:text-6xl">Travel power guidance without the electrical jargon.</h1>
        <p className="mt-6 text-lg leading-8 text-muted">TravelPlug compares the plugs, voltage, and frequency used at home and at your destination, then leads with the action that matters: bring an adapter, check your device, or use a suitable converter.</p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <article className="rounded-[1.75rem] border bg-surface p-6 sm:p-8">
          <Globe2 className="size-8 text-brand" aria-hidden="true" />
          <h2 className="mt-5 text-2xl font-bold">Built for worldwide journeys</h2>
          <p className="mt-3 leading-7 text-muted">Explore 242 country and territory guides, every plug type from A to O, and plain-language guidance for common travel devices.</p>
          <Link href="/#compare" className="mt-5 inline-flex min-h-11 items-center font-bold text-brand-strong">Compare countries →</Link>
        </article>
        <article className="rounded-[1.75rem] border bg-surface p-6 sm:p-8">
          <HeartHandshake className="size-8 text-olive" aria-hidden="true" />
          <h2 className="mt-5 text-2xl font-bold">Open source by design</h2>
          <p className="mt-3 leading-7 text-muted">The source code is public under the Apache License 2.0. Contributions that improve clarity, accessibility, data quality, or coverage are welcome.</p>
          <TrackedExternalLink
            href="https://github.com/sa1755/travel-plug-comparison"
            target="_blank"
            rel="noreferrer"
            eventName="GitHub Link Clicked"
            eventProperties={{ location: "about" }}
            className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold text-brand-strong"
            aria-label="View TravelPlug on GitHub (opens in a new tab)"
          >
            <Code2 className="size-5" aria-hidden="true" /> View TravelPlug on GitHub
          </TrackedExternalLink>
        </article>
      </div>
    </section>
  );
}
