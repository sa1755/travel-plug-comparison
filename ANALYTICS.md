# TravelPlug analytics

TravelPlug uses a small, centralized analytics layer. Product features never
depend on analytics, and provider failures are deliberately ignored.

## Providers and purpose

| Provider | Purpose | Activation |
| --- | --- | --- |
| Vercel Web Analytics | Aggregate visitors, page views, referrers, countries, devices, popular pages, and product events | Enabled in production unless `NEXT_PUBLIC_ANALYTICS_ENABLED=false` |
| Vercel Speed Insights | Real-user Core Web Vitals and mobile/desktop performance | Root-layout component; enabled with the same analytics switch |
| Google Analytics 4 | Optional session, acquisition, funnel, and deeper event reporting | Loaded only when a valid measurement ID is configured **and** the visitor explicitly opts in |

Vercel remains the primary low-overhead provider. GA4 adds session and funnel
reporting that Vercel's basic dashboard does not replace, but it is optional
because it uses a first-party client identifier and adds a third-party script.

## Environment variables

```dotenv
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

- Set `NEXT_PUBLIC_ANALYTICS_ENABLED=false` to suppress Vercel Analytics, Speed
  Insights, GA4, and custom events.
- Leave `NEXT_PUBLIC_GA_MEASUREMENT_ID` blank to omit GA4 and its consent prompt.
- To enable GA4, use a public web-stream ID such as `G-XXXXXXXXXX`. It is an
  identifier, not a secret. Never put a Measurement Protocol API secret in a
  `NEXT_PUBLIC_` variable.

For local development, copy `.env.example` to `.env.local`. Use a separate GA4
test property/data stream if local events must be inspected. In Vercel, add the
measurement ID under Project Settings → Environment Variables for Production
and redeploy.

## Events and parameters

Automatic Vercel page views and consented GA4 `page_view` events have query
strings and fragments removed.

| Event | Useful parameters |
| --- | --- |
| `landing_page_view` | `landing_path` |
| `origin_country_selected` | `origin_country` |
| `destination_country_selected` | `destination_country` |
| `countries_swapped` | `origin_country`, `destination_country` |
| `comparison_started` | `entry_point` |
| `comparison_completed` | `origin_country`, `destination_country`, `origin_plug_type`, `destination_plug_type`, `adapter_required`, `converter_required` |
| `device_checker_opened` | None |
| `device_checked` | `device_category`, `compatibility_result`, origin and destination identifiers |
| `adapter_recommendation_viewed` | Route, adapter type, retailer, and product ID |
| `adapter_product_clicked` | Route, adapter type, retailer, and product ID |
| `github_link_clicked` | `location` |
| `search_used` | `result_kind` only; never the typed query |
| `error_encountered` | A bounded `error_type`, never a raw error message |

An adapter click is not a sale. Revenue and conversion claims require reporting
from the retailer or affiliate network.

## Privacy and consent

TravelPlug never intentionally sends names, emails, passwords, payment data,
precise coordinates, typed search text, device-label contents, or sensitive
personal information. Event fields use public catalog identifiers and bounded
result categories.

Vercel describes Web Analytics as cookie-free and aggregated. TravelPlug also
strips URL queries/fragments and suppresses all providers when the browser sends
Do Not Track. GA4 uses Google's **basic consent mode**: its script does not load
and no data is sent until the visitor selects “Allow analytics.” Advertising
storage, Google Signals, and ad personalization are disabled. Visitors can
reopen the choice from `/privacy`.

This is an implementation description, not jurisdiction-specific legal advice.
Reassess consent and disclosure requirements before enabling advertising,
session replay, persistent cross-site identifiers, or a new provider.

## Testing locally

1. Leave `NEXT_PUBLIC_GA_MEASUREMENT_ID` blank and confirm the comparison still
   works with analytics unavailable.
2. Set a test GA4 ID, restart the development server, and confirm the choice
   prompt appears.
3. Decline and verify no request is made to `googletagmanager.com`.
4. Accept and use the browser Network panel to verify `gtag/js` loads and GA
   collection requests appear.
5. Set the browser's Do Not Track preference and verify Vercel, Speed Insights,
   and GA4 requests are suppressed.
6. Exercise country selection, comparison, device checking, search, GitHub, and
   a test-only adapter fixture. Do not add fake products to the public catalog.

Provider dashboards can take time to process events; a successful request does
not imply that real visitor data already exists.

## Viewing data

- **Vercel:** open the project in Vercel, then Analytics for visitors, page
  views, dimensions, and custom events. Open Speed Insights for Core Web Vitals.
- **GA4:** open the configured property in Google Analytics. Realtime and
  DebugView are useful during setup; standard acquisition, engagement, and
  Explore reports answer session and funnel questions after consented traffic
  exists. Register important custom parameters as custom dimensions when needed.

## Adding a future event

1. Add a concise snake-case name to `AnalyticsEventName` in
   `src/lib/analytics.ts`.
2. Call `trackEvent()` at the point where the meaningful action succeeds, not
   merely when a button is rendered.
3. Use only flat string, number, boolean, or null properties. Vercel limits event
   names, keys, and values to 255 characters.
4. Add the event and parameter purpose to this document and the privacy notice
   if the data category changes.
5. Test with providers blocked to confirm the feature still works.

## Implementation locations

- `src/components/analytics/analytics-provider.tsx` renders Vercel Web
  Analytics once and owns the optional GA4 consent lifecycle.
- `src/components/analytics/speed-insights-provider.tsx` wraps the official
  `@vercel/speed-insights/next` component so the environment switch and browser
  Do Not Track preference remain effective.
- `src/app/layout.tsx` renders both providers once at the root without changing
  the theme-init script or structured data.
- `src/lib/analytics.ts` is the only product-event API used by features.
