# TravelPlug analytics

TravelPlug uses [Vercel Web Analytics](https://vercel.com/docs/analytics). It was
chosen because the site is deployed on Vercel, integration is small, page views
work with Next.js navigation, and Vercel documents a cookie-free, aggregated,
privacy-focused data model.

## Data collected

Automatic page views may include the page path, referrer, approximate country or
region, browser, operating system, device type, and event time. TravelPlug strips
query strings and fragments before a page view is sent. Vercel describes its
visitor measurement as anonymous, without a persistent cross-site identifier.

TravelPlug never intentionally sends names, email addresses, precise location,
typed search queries, device label contents, or other free-form user input.

## Events

| Event | Properties | Product question |
| --- | --- | --- |
| Page view | Page path and Vercel's standard aggregate context | Which pages and guides are useful? |
| `Country Selected` | Role and country slug | Which origins and destinations are selected? |
| `Comparison Started` | Entry point | Where does the comparison funnel begin? |
| `Comparison Completed` | Origin and destination slugs | Which routes are compared, and how often is the journey completed? |
| `Device Checker Opened` | None | How often is device-specific guidance explored? |
| `Device Checked` | Device profile, origin, and destination slugs | Which general devices are checked most often? |
| `Search Used` | Result kind only | Does search lead people to country or plug guides? |
| `GitHub Link Clicked` | Link location | How often do visitors explore the source project? |

Custom events are visible only on Vercel plans that include that feature. Page
views remain available independently. Analytics failure or blocking does not
interrupt any TravelPlug feature.

## Privacy and consent

The selected analytics configuration does not set analytics cookies. TravelPlug
therefore does not show a cookie banner solely for Vercel Web Analytics. The
site respects the browser's Do Not Track signal and suppresses analytics when
it is set to `1`.

This is a technical implementation note, not jurisdiction-specific legal
advice. Before adding advertising, session replay, persistent identifiers, or
new analytics properties, reassess the privacy notice and consent requirements.

## Configuration

1. Enable Web Analytics for the Vercel project in its Analytics dashboard.
2. Deploy the application; page views and supported custom events are then sent
   through Vercel's first-party analytics endpoint.
3. To disable all analytics, set `NEXT_PUBLIC_ANALYTICS_ENABLED=false` at build
   time and redeploy.

Do not add secrets to this public environment variable.
