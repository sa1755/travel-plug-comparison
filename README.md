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
- Privacy-conscious, cookie-free product analytics
- Responsive, keyboard-accessible, reduced-motion-aware interface

## Technology stack

- Next.js 16 App Router and React 19
- TypeScript in strict mode
- Tailwind CSS 4
- Zod, React Hook Form, Lucide React, and Framer Motion
- Vitest and Testing Library
- Vercel Web Analytics and Vercel deployment

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

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

The end-to-end suite runs against an existing production build.

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
