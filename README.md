# TravelPlug

TravelPlug helps international travellers compare socket types, voltage,
frequency, and device compatibility between their home country and destination.

**Live site:** [travel-plug-comparison.vercel.app](https://travel-plug-comparison.vercel.app)

The current application includes a validated 17-country electrical catalog, a
country comparison form, 272 statically generated comparison guides, country
and plug reference pages, global catalog search, and an eight-profile device
checker with cautious guidance.

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
