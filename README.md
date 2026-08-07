# TravelPlug

TravelPlug helps international travellers compare socket types, voltage,
frequency, and device compatibility between their home country and destination.

**Live site:** [travel-plug-comparison.vercel.app](https://travel-plug-comparison.vercel.app)

The current application includes a validated 242-location electrical catalog,
answer-first country comparisons, 242 country guides, all plug types A–O,
global catalog search, an optional globe explorer, and a nine-profile device
checker. Comparison results summarize eight common travel devices immediately.

## Local development

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

The end-to-end suite runs against an existing production build.

## Production

Canonical metadata automatically uses the Vercel production domain. See
[DEPLOYMENT.md](DEPLOYMENT.md) for release steps and [QUALITY_AUDIT.md](QUALITY_AUDIT.md)
for the Phase 5 performance and accessibility evidence.

See [PROJECT_SPEC.md](PROJECT_SPEC.md) for the product requirements,
[ARCHITECTURE.md](ARCHITECTURE.md) for technical decisions, and
[TASKS.md](TASKS.md) for phased delivery status. The optional globe assessment
is recorded in [GLOBE_EVALUATION.md](GLOBE_EVALUATION.md).
