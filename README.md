# TravelPlug

**Does your charger work abroad? Check before you fly.**

[Live Demo](https://travel-plug-comparison.vercel.app/) · [GitHub](https://github.com/sa1755/travel-plug-comparison)

TravelPlug gives international travellers a clear answer about plug adapters,
voltage converters, and common device compatibility between their home country
and destination.

![TravelPlug website preview](https://travel-plug-comparison.vercel.app/opengraph-image)

## What TravelPlug does

Choose where you are travelling from and where you are going. TravelPlug
compares socket types, nominal voltage, and frequency, then leads with a simple
recommendation before showing the technical detail.

## Main features

- Answer-first comparisons for any supported country pair
- 242 country and territory electrical guides
- Plug types A–O with visual socket and plug guidance
- General guidance for nine common travel-device profiles
- Searchable country selectors and global catalog search
- Optional interactive globe with an accessible list fallback
- Shareable comparison URLs and indexable static guides
- Privacy-conscious product analytics and real-user performance monitoring
- Affiliate-ready adapter recommendations that remain hidden until real, reviewed products are configured
- Responsive, keyboard-accessible, reduced-motion-aware interface

## Technology stack

- Next.js 16 App Router and React 19
- TypeScript in strict mode
- Tailwind CSS 4
- Zod, React Hook Form, Lucide React, and Framer Motion
- Vitest and Testing Library
- Vercel Web Analytics, Speed Insights, optional consented GA4, and Vercel deployment

## Getting started

Requirements: Node.js 20.9 or newer and npm.

```bash
git clone https://github.com/sa1755/travel-plug-comparison.git
cd travel-plug-comparison
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No database or secret
application variables are required. Copy `.env.example` only when you want to
override the canonical origin or analytics setting.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Optional canonical origin override |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | Set to `false` to disable all analytics |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional public GA4 web-stream ID; blank disables GA4 and its consent prompt |

No analytics secret belongs in a `NEXT_PUBLIC_` variable. See
[ANALYTICS.md](ANALYTICS.md) for local and Vercel configuration.

## Analytics overview

Vercel Web Analytics supplies aggregate traffic and product events, while
Vercel Speed Insights measures real-user Core Web Vitals. Optional GA4 adds
consented session, acquisition, and funnel reporting. Events pass through the
typed utility in `src/lib/analytics.ts`; analytics failures never block the
comparison journey.

## Affiliate architecture

TravelPlug recommends products only when an adapter is actually needed. The
public product catalog is intentionally empty until genuine retailer products
and URLs have been reviewed. Future products are configured in
`src/data/adapter-products.ts`, matched through
`src/services/product-recommendation-service.ts`, and displayed with a nearby
affiliate disclosure and view/click events. No product click is treated as a
sale.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

The end-to-end suite runs against an existing production build.

The current HTTP smoke suite validates representative routes and assets. A
real-browser Playwright suite is still recommended before broad promotion for
hydration, keyboard, WebGL, reduced-motion, and responsive-layout coverage.

## Project structure

```text
src/
├── app/          Routes, layouts, metadata, and APIs
├── components/   UI, comparison, country, device, globe, and layout components
├── data/         Validated country, plug, city, and device records
├── lib/          Comparison rules, schemas, analytics, and configuration
├── services/     Read-only access to validated catalogs
├── types/        Shared domain types
└── utils/        Small reusable helpers
```

For deeper context, see [PROJECT_SPEC.md](PROJECT_SPEC.md),
[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md), [ARCHITECTURE.md](ARCHITECTURE.md), and
[TASKS.md](TASKS.md). Deployment is covered in [DEPLOYMENT.md](DEPLOYMENT.md),
and collected analytics are documented in [ANALYTICS.md](ANALYTICS.md).

## Contributing

Issues and pull requests are welcome. Keep electrical guidance cautious and
sourceable, preserve accessible equivalents for visual interactions, add tests
for changed behavior, and run the complete quality checks before submitting.
By submitting a contribution, you agree that it is licensed under this
project's Apache License 2.0.

## License

Licensed under the Apache License 2.0. See [LICENSE](LICENSE).

Third-party packages and data remain subject to their own licenses; this project
does not claim ownership of them.

## Links

- **Live website:** [https://travel-plug-comparison.vercel.app/](https://travel-plug-comparison.vercel.app/)
- **GitHub:** [https://github.com/sa1755/travel-plug-comparison](https://github.com/sa1755/travel-plug-comparison)
- **Privacy:** [https://travel-plug-comparison.vercel.app/privacy](https://travel-plug-comparison.vercel.app/privacy)
