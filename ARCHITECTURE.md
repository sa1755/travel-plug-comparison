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

Phase 2 establishes four central concepts:

1. `Country` — stable code and slug, aliases, display identity, plug types,
   nominal voltages, supported frequencies, regional caveats, and travel advice.
2. `Plug` — plug type, slug, description, technical details, image reference,
   and related countries.
3. `DeviceProfile` — typical voltage behaviour and warnings, presented as
   guidance rather than a guarantee about a particular appliance.
4. `ComparisonResult` — separate plug, voltage, and frequency findings plus a
   concise recommendation and device warnings.

Repository JSON is untrusted at the boundary and is parsed once through Zod.
Services expose deeply immutable, typed lookup functions. Cross-record checks
ensure unique identities, complete required records, and valid country-to-plug
references. Plug-to-country relationships are derived from country records, so
the relationship has one source of truth.

Voltages and frequencies are arrays. This prevents the model from hiding
regional reality in places such as Brazil (127/220 V) and Japan (50/60 Hz).
The plug catalog includes Types A–O: Type O extends the original A–N brief so
Thailand can be represented accurately. Stable `imageKey` values reserve future
asset identities without introducing Phase 4 artwork or broken paths.

`country-service`, `plug-service`, and `device-service` own parsed catalogs,
lookups, search, and static route parameters. `catalog-service` owns whole-set
integrity assertions. Raw JSON must not be imported by routes or components.

Electrical records and their update policy are documented in
`src/data/README.md`. Device records are general guidance and never override the
rating label or manufacturer instructions for a specific appliance.

Comparison rules are pure functions in `src/lib/comparison.ts`; they do not
import React, routes, or raw data. The rules are deliberately cautious:

- Plug compatibility evaluates each home plug against a documented socket-fit
  map. It returns fully supported, partially supported, or adapter required. It
  never treats physical fit as proof of electrical compatibility.
- Voltage returns exact nominal match, similar low/high system with a device
  check, variable destination supply, or a materially different voltage system
  where a converter may be required. The low system covers 100–127 V and the
  high system covers 220–240 V; exact device input ratings remain authoritative.
- Frequency returns exact match, variable destination supply, or a device check.
  It is kept separate because chargers, motors, clocks, and medical equipment do
  not respond identically to a frequency difference.
- Device findings combine those route-level results with the validated profile.
  Dual-voltage is described as typical rather than guaranteed, high-power
  single-voltage devices receive stronger warnings, and medical profiles always
  defer to manufacturer guidance.

Ambiguous cases say “check the device label” rather than claim universal safety.
Every branch is covered by unit tests, including multi-voltage and dual-frequency
destinations.

## Routes

| Route | Rendering | Purpose |
| --- | --- | --- |
| `/` | Static shell + client form | Primary comparison journey |
| `/compare/[from]/[to]` | Static | Shareable compatibility result |
| `/country/[country]` | Static | Country electrical guide |
| `/plug/[type]` | Static | Plug technical guide and countries |
| `/device-checker` | Static shell + client form | Device-specific guidance |

Search is an accessible client interaction over the small validated local data
set. If the data set later becomes remote or substantially larger, it can move
behind a service without changing route components.

Phase 4 implements every known country and plug route statically. Global search
receives a serializable, prevalidated search index from the server and performs
only ranking and filtering in its client island; raw JSON and Zod parsing do not
enter the browser bundle. The device checker receives immutable country and
device records, validates its three selections, and delegates all findings to
the same pure comparison engine as route pages.

The comparison form is the smallest client boundary. It uses React Hook Form for
field state and the shared Zod schema for route-safe validation. The selected
slugs become the URL source of truth. All 17 × 16 directed comparison routes are
prerendered; same-country and unknown routes are excluded and resolve as not
found.

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
The Phase 4 assessment and explicit implementation gates are recorded in
`GLOBE_EVALUATION.md`; its current decision is to defer the globe and library
selection while retaining global search as the equivalent accessible path.

## Metadata and deployment

The root layout owns the metadata base, title template, and default social data.
Every public route derives a unique canonical path, title, and description from
validated records. The production origin prefers `NEXT_PUBLIC_SITE_URL`, then
Vercel's stable production-domain variable. App Router metadata routes generate
the social image, icons, manifest, sitemap, and environment-aware robots policy.

Vercel is the intended runtime. The application will not require a database in
its initial version, so preview and production builds are deterministic. The
deployment step requires repository and Vercel access and is intentionally kept
separate from local implementation.

Measured client-boundary, static-output, contrast, motion, and responsive-layout
findings are recorded in `QUALITY_AUDIT.md`. Environment and release operations
are documented in `DEPLOYMENT.md`.

## Testing strategy

- Unit tests cover schemas, referential integrity, lookup helpers, slugs, and all
  comparison rule branches.
- Component tests cover selector validation, search behaviour, result states,
  and device guidance.
- Component interaction tests cover the main journey, validation, search
  keyboard behavior, and device guidance. HTTP end-to-end tests start the
  optimized server and verify representative routes, metadata, discovery files,
  generated imagery, and 404 behavior.
- `npm run lint`, `npm run typecheck`, the automated test suite, and
  `npm run build` must pass at the end of each applicable phase.

## Delivery rules

Each phase is independently reviewed, verified, and committed. Later-phase
features must not be pulled into an earlier milestone merely to make a visual
demo appear complete. Decisions that change the domain model or public URL
shape are recorded here before implementation.
