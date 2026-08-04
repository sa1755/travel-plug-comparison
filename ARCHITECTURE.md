# TravelPlug architecture

## Goals

TravelPlug is a content-rich comparison application. The architecture favours
static, server-rendered pages and pure domain functions so that country guides
are fast, indexable, and straightforward to test. Client components are reserved
for interactions such as selectors, search, and the device checker.

## Technology baseline

- Next.js 16 App Router and React 19
- TypeScript in strict mode
- Tailwind CSS 4 with project design tokens in `src/app/globals.css`
- Zod at data and user-input boundaries
- React Hook Form for forms that need managed client state
- Framer Motion for purposeful, reduced-motion-aware interaction
- Lucide React for interface icons

Node.js 20.9 or newer is required. Dependencies are locked by
`package-lock.json`, and the continuous quality gate is lint, type checking,
automated tests, and a production build.

The production build explicitly uses Next.js's supported Webpack compiler. This
keeps builds deterministic in restricted CI hosts where Turbopack's CSS worker
cannot open its local IPC port; application rendering and App Router behaviour
are unchanged.

## Source boundaries

```text
src/
├── app/                 Routes, layouts, metadata, and route-level composition
├── components/
│   ├── ui/              Small generic visual primitives
│   ├── country/         Country discovery and country-detail presentation
│   ├── comparison/      Comparison form and result presentation
│   ├── device/          Device checker presentation
│   └── layout/          Site-wide header, footer, and navigation
├── data/                Version-controlled country, plug, and device records
├── hooks/               Reusable client-side React behaviour
├── lib/                 Domain rules and application-level helpers
├── services/            Read-only access to validated application data
├── styles/              Future non-global style assets when needed
├── types/               Shared domain and transport types
└── utils/               Small domain-independent utilities
```

Imports should point inward: routes compose components and services; services
read data and schemas; presentation components consume typed values. Domain
rules must not import React or route modules.

## Rendering strategy

- The root layout, static content, result pages, country pages, and plug pages
  remain React Server Components by default.
- Only the smallest interactive leaf receives `"use client"`.
- Known country, plug, and comparison routes are generated statically from the
  validated data set where the route count remains practical.
- Unsupported slugs resolve through `notFound()` rather than rendering partial
  content.
- URL segments are the source of truth for comparisons, making results linkable
  and indexable.

## Data and domain model

Phase 2 will establish four central concepts:

1. `Country` — stable code and slug, display identity, plug types, nominal
   voltage, supported frequencies, and travel advice.
2. `Plug` — plug type, slug, description, technical details, image reference,
   and related countries.
3. `DeviceProfile` — typical voltage behaviour and warnings, presented as
   guidance rather than a guarantee about a particular appliance.
4. `ComparisonResult` — separate plug, voltage, and frequency findings plus a
   concise recommendation and device warnings.

Repository JSON is untrusted at the boundary and is parsed once through Zod.
Services expose immutable, typed lookup functions. Cross-record checks ensure
unique codes/slugs and valid country-to-plug references.

Comparison rules will be pure functions. Plug compatibility is based on the
intersection of socket types; voltage guidance uses explicit tolerance rules;
frequency is reported separately because its importance depends on the device.
Ambiguous electrical cases must say “check the device label” rather than claim
universal safety. Rules and thresholds will be documented beside their tests.

## Routes

| Route | Rendering | Purpose |
| --- | --- | --- |
| `/` | Static shell + interactive selector | Primary comparison journey |
| `/compare/[from]/[to]` | Static/server | Shareable compatibility result |
| `/country/[country]` | Static | Country electrical guide |
| `/plug/[type]` | Static | Plug technical guide and countries |
| `/device-checker` | Static shell + client form | Device-specific guidance |

Search is an accessible client interaction over the small validated local data
set. If the data set later becomes remote or substantially larger, it can move
behind a service without changing route components.

## Design system and accessibility

`DESIGN_SYSTEM.md` is the visual and interaction contract. Travel Blue identifies
navigation, actions, and selection; it is intentionally separate from electrical
status. Green communicates compatible/safe guidance, amber indicates a check or
caveat, and red indicates an incompatible or converter-required outcome. Colour
is always paired with text and an icon.

Reusable UI primitives must preserve visible keyboard focus, semantic labels,
adequate touch targets, and reduced-motion preferences. The application starts
mobile-first and expands at content-driven breakpoints.

### Future globe boundary

Interactive globe exploration is optional and subordinate to the quick country
comparison journey. It is not implemented in the foundation or data phases.
After validated country services exist, it may be introduced as a dynamically
loaded client island that receives serializable country summaries and emits a
country selection. It must not own electrical compatibility rules or read raw
JSON directly.

The globe must have an equivalent keyboard-accessible list/search path, support
reduced motion and non-WebGL environments, and load without delaying primary
page content. Library selection is deferred until the country data shape,
accessibility behaviour, and performance budget can be evaluated together.

## Metadata and deployment

The root layout owns title templates and default social metadata. Detail routes
derive unique titles and descriptions from validated records. Phase 5 adds the
canonical production origin, generated Open Graph imagery, sitemap, and robots
configuration.

Vercel is the intended runtime. The application will not require a database in
its initial version, so preview and production builds are deterministic. The
deployment step requires repository and Vercel access and is intentionally kept
separate from local implementation.

## Testing strategy

- Unit tests cover schemas, referential integrity, lookup helpers, slugs, and all
  comparison rule branches.
- Component tests cover selector validation, search behaviour, result states,
  and device guidance.
- End-to-end tests cover the main journey, representative detail pages, keyboard
  navigation, and mobile viewports.
- `npm run lint`, `npm run typecheck`, the automated test suite, and
  `npm run build` must pass at the end of each applicable phase.

## Delivery rules

Each phase is independently reviewed, verified, and committed. Later-phase
features must not be pulled into an earlier milestone merely to make a visual
demo appear complete. Decisions that change the domain model or public URL
shape are recorded here before implementation.
