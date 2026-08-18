import type { Metadata } from "next";

import { AnalyticsPreferencesButton } from "@/components/analytics/analytics-preferences-button";
import { createPageMetadata } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy",
  description: "How TravelPlug handles analytics, location choices, local preferences, and product events.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="page-container py-14 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="section-label">Privacy</p>
        <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] sm:text-6xl">Simple analytics, minimal data.</h1>
        <p className="mt-6 text-lg leading-8 text-muted">TravelPlug uses privacy-conscious measurement to improve the product. Optional Google Analytics is loaded only after you choose to allow it.</p>

        <div className="mt-10 space-y-9 text-base leading-7 text-muted">
          <section>
            <h2 className="text-2xl font-bold text-foreground">What is collected</h2>
            <p className="mt-3">Vercel records aggregate page views, product events, performance metrics, and limited technical context such as the page path, referrer, approximate region, browser, operating system, and device type. Query strings and fragments are removed before page views are sent.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-foreground">Product events</h2>
            <p className="mt-3">TravelPlug records useful, non-sensitive actions such as comparison progress, country identifiers, general plug outcomes, device categories, search-result types, GitHub clicks, and—in future—views or clicks on genuine adapter recommendations. It does not claim that a product click is a purchase.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-foreground">What is not collected</h2>
            <p className="mt-3">TravelPlug does not intentionally send names, email addresses, typed search text, precise coordinates, device-label contents, payment information, or sensitive personal information to analytics. Browser geolocation is processed locally to identify a country; precise coordinates are not sent to TravelPlug analytics.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-foreground">Location and local storage</h2>
            <p className="mt-3">If you allow browser location, precise coordinates stay in your browser while TravelPlug matches them to a country. If that fails or permission is denied, the same-origin location endpoint may use Vercel’s country-only request header, which is derived from the request’s approximate region. Your selected home-country slug, theme, and optional Google Analytics choice are stored in your browser’s local storage.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-foreground">Cookies and choice</h2>
            <p className="mt-3">Vercel Web Analytics does not use analytics cookies. When a GA4 measurement ID is configured, Google Analytics remains blocked until you select “Allow analytics”; if accepted, Google may set first-party <code className="rounded bg-surface-muted px-1.5 py-0.5 text-sm text-foreground">_ga</code> cookies to distinguish visitors and sessions. Advertising storage, Google Signals, and ad personalization are disabled by the site configuration. Do Not Track suppresses all configured analytics.</p>
            <AnalyticsPreferencesButton />
          </section>
          <section>
            <h2 className="text-2xl font-bold text-foreground">Affiliate recommendations</h2>
            <p className="mt-3">TravelPlug does not currently display affiliate products. If reviewed affiliate links are added later, recommendations will appear only when the electrical comparison indicates that an adapter may be needed. A clear disclosure will appear beside those links. TravelPlug may then earn a commission from a qualifying purchase; it does not add a separate TravelPlug fee, although the retailer’s own prices and terms still apply. Product clicks do not tell TravelPlug whether a purchase was completed.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-foreground">Control and retention</h2>
            <p className="mt-3">You can decline optional Google Analytics or reopen the choice above. Analytics retention and deletion are managed in the corresponding Vercel and Google project settings. For a privacy request, contact the project maintainer through the <a className="font-semibold text-brand-strong underline" href="https://github.com/sa1755/travel-plug-comparison/issues" target="_blank" rel="noreferrer">GitHub issue tracker</a>; do not include sensitive information in a public issue. This notice describes the implementation and is not a claim of compliance with every jurisdiction.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-foreground">More information</h2>
            <p className="mt-3">See the project’s <a className="font-semibold text-brand-strong underline" href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noreferrer">Vercel privacy reference</a>, <a className="font-semibold text-brand-strong underline" href="https://support.google.com/analytics/answer/11593727" target="_blank" rel="noreferrer">Google Analytics data reference</a>, and <a className="font-semibold text-brand-strong underline" href="https://github.com/sa1755/travel-plug-comparison/blob/main/ANALYTICS.md" target="_blank" rel="noreferrer">implementation documentation</a>. This notice was last updated 18 August 2026.</p>
          </section>
        </div>
      </div>
    </article>
  );
}
