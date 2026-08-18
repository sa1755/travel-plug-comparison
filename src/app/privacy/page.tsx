import type { Metadata } from "next";

import { createPageMetadata } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy",
  description: "How TravelPlug uses privacy-conscious, cookie-free website analytics.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="page-container py-14 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="section-label">Privacy</p>
        <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] sm:text-6xl">Simple analytics, minimal data.</h1>
        <p className="mt-6 text-lg leading-8 text-muted">TravelPlug uses Vercel Web Analytics to understand aggregate product usage without following people around the web.</p>

        <div className="mt-10 space-y-9 text-base leading-7 text-muted">
          <section>
            <h2 className="text-2xl font-bold text-foreground">What is collected</h2>
            <p className="mt-3">Vercel records anonymous page views and limited technical context such as the page path, referrer, approximate region, browser, operating system, and device type. Query strings are removed before page views are sent.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-foreground">Product events</h2>
            <p className="mt-3">TravelPlug records when a comparison starts or completes, which country identifiers were selected, when the device checker is opened, which general device profile is checked, when a search result is used, and when a GitHub link is clicked. These events help improve the comparison journey and content coverage.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-foreground">What is not collected</h2>
            <p className="mt-3">TravelPlug does not send names, email addresses, typed search text, precise coordinates, device label details, advertising identifiers, or a persistent user ID to analytics. Browser geolocation is processed locally to identify a country; precise coordinates are not sent to TravelPlug analytics.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-foreground">Cookies and choice</h2>
            <p className="mt-3">Vercel Web Analytics does not use analytics cookies, so TravelPlug does not show a cookie-consent banner solely for this service. Analytics respects the browser Do Not Track signal. The project owner can disable it completely at build time by setting <code className="rounded bg-surface-muted px-1.5 py-0.5 text-sm text-foreground">NEXT_PUBLIC_ANALYTICS_ENABLED=false</code>.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-foreground">More information</h2>
            <p className="mt-3">See the project’s <a className="font-semibold text-brand-strong underline" href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noreferrer">Vercel Web Analytics privacy reference</a> and <a className="font-semibold text-brand-strong underline" href="https://github.com/sa1755/travel-plug-comparison/blob/main/ANALYTICS.md" target="_blank" rel="noreferrer">analytics documentation</a>. This notice was last updated 14 August 2026.</p>
          </section>
        </div>
      </div>
    </article>
  );
}
