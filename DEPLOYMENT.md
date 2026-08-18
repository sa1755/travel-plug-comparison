# TravelPlug deployment

Production URL: [https://travel-plug-comparison.vercel.app](https://travel-plug-comparison.vercel.app)

The initial production deployment was verified on 4 August 2026. The Vercel
project is `sana-525f/travel-plug-comparison`. Automatic deployment from the
GitHub `main` branch and the production URL were verified on 18 August 2026.

## Requirements

- Node.js 20.9 or newer
- A GitHub repository with `main` as the production branch
- A Vercel account with access to the repository

TravelPlug has no database and requires no secret application variables. Its
canonical origin resolves in this order:

1. `NEXT_PUBLIC_SITE_URL` when explicitly configured;
2. Vercel's `VERCEL_PROJECT_PRODUCTION_URL`; or
3. `https://travel-plug-comparison.vercel.app` for deterministic local builds.

Do not set `NEXT_PUBLIC_SITE_URL` to a preview deployment. Vercel's production
domain variable is preferable because it remains stable across previews.

Enable Web Analytics in the Vercel project dashboard before the release is
deployed. No analytics secret is required. Set
`NEXT_PUBLIC_ANALYTICS_ENABLED=false` only when analytics should be disabled;
the default production behavior is enabled. See [ANALYTICS.md](ANALYTICS.md).

Enable Speed Insights in the same Vercel project. To use optional GA4, create a
GA4 web data stream, add its public measurement ID as
`NEXT_PUBLIC_GA_MEASUREMENT_ID`, and redeploy. Leave the variable blank to keep
GA4 and its consent prompt out of the build. Do not add a Measurement Protocol
secret to a public environment variable.

## Local release check

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
npm run test:browser
```

The HTTP suite requires the production build and briefly opens localhost port
3210. Set `TRAVELPLUG_E2E_PORT` if that port is occupied. The Playwright suite
launches its own production server on dedicated port 3110 and never reuses an
existing process. It requires its Chromium runtime (`npx playwright install
chromium` locally; CI installs the browser and operating-system dependencies).

## GitHub-connected Vercel deployment

1. Import `sa1755/travel-plug-comparison` from the Vercel dashboard.
2. Keep the detected framework as Next.js and the root directory as the
   repository root.
3. Use `npm ci` for installation and `npm run build` for the build command.
4. Keep `main` as the production branch.
5. Ensure Vercel system environment variables are exposed. New projects enable
   these by default.
6. Deploy and verify the production URL using the checklist below.

Once connected, every push to `main` creates a production deployment and branch
or pull-request commits create previews. Preview builds return a disallow-all
`robots.txt`; production builds are indexable.

## CLI alternative

```bash
npx vercel login
npx vercel link
npx vercel --prod
```

The `.vercel` directory is local account state and must remain uncommitted.

## Production verification

Verify the following against the final production origin:

- `/`, `/country/japan`, `/plug/type-g`, `/device-checker`, and a representative
  comparison return 200;
- an unsupported country returns 404 with a recovery link;
- canonical and Open Graph URLs use the production origin;
- `/sitemap.xml` contains 265 public URLs;
- `/robots.txt` references the production sitemap;
- `/manifest.webmanifest`, `/icon`, `/apple-icon`, and `/opengraph-image` load;
- security headers are present and optional GA4 remains blocked before consent;
- Vercel Web Analytics and Speed Insights are enabled in the project dashboard;
- a push to `main` creates a new production deployment; and
- the Vercel deployment reports the same Git commit as GitHub `main`.

Rollback by promoting the last known-good Vercel deployment or reverting the
offending commit on `main`; never rewrite shared production history.

## Remaining manual compatibility checks

Before broad promotion, manually check Safari on iOS/macOS, a low-end Android
device, and representative keyboard and screen-reader journeys. Run axe or an
equivalent accessibility audit in a real production browser. These checks are
deliberately not marked complete by the Chromium release suite.
