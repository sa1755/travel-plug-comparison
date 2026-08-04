# TravelPlug delivery plan

Status key: `[x]` complete, `[~]` in progress, `[ ]` not started.

## Phase 1 — Foundation

- [x] Review the repository, full project specification, Git state, and local
  runtime.
- [x] Define the phased architecture, source boundaries, rendering strategy,
  testing approach, and delivery rules.
- [x] Configure Next.js App Router, React, strict TypeScript, Tailwind CSS,
  PostCSS, ESLint, and the required product libraries.
- [x] Create the requested `src` folder structure and import alias.
- [x] Establish semantic colour, typography, spacing, surface, and focus styles.
- [x] Create the root metadata, responsive header/footer, brand mark, and durable
  homepage introduction.
- [x] Generate the dependency lockfile and pass lint, type checking, and a
  production build.
- [x] Commit the verified Phase 1 foundation.

## Phase 2 — Data

- [ ] Define plug, country, device, severity, and comparison TypeScript models.
- [ ] Define Zod schemas and parse every version-controlled data source at its
  service boundary.
- [ ] Add all 17 initial countries with codes, slugs, flags, sockets, nominal
  voltage, frequencies, and concise travel advice.
- [ ] Add plug types A through N with slugs, descriptions, technical details,
  image references, and country relationships.
- [ ] Add device profiles for the eight specified device categories.
- [ ] Implement immutable lookup, filtering, cross-reference, and static-route
  utilities.
- [ ] Add integrity tests for duplicate identities, invalid references, missing
  required records, and service lookups.
- [ ] Pass the complete Phase 2 quality gate and commit the data milestone.

## Phase 3 — Main product

- [ ] Build an accessible country selector and validated comparison form.
- [ ] Keep selected countries in the shareable comparison URL.
- [ ] Implement and document pure plug, voltage, and frequency comparison rules.
- [ ] Add severity badges, comparison cards, plug cards, recommendation summary,
  and device-warning presentation.
- [ ] Complete homepage “How it works”, adapter education, popular destinations,
  and travel tips sections.
- [ ] Implement `/compare/[from]/[to]` with metadata, country identity, complete
  findings, invalid-route handling, and a path to start another comparison.
- [ ] Test all domain rule branches and representative comparison journeys.
- [ ] Pass the complete Phase 3 quality gate and commit the main product.

## Phase 4 — Expansion

- [ ] Implement `/country/[country]` with plug details, power information, travel
  advice, and compatible-country links.
- [ ] Implement `/plug/[type]` with imagery, description, technical facts, and
  countries using the plug.
- [ ] Implement accessible global search across countries and plug types.
- [ ] Implement `/device-checker` for all specified device profiles, with clear
  device-label caveats.
- [ ] Add loading, empty, validation, and not-found states where applicable.
- [ ] Test search, detail routes, the device checker, keyboard use, and responsive
  layouts.
- [ ] Pass the complete Phase 4 quality gate and commit the expansion milestone.

## Phase 5 — Production

- [ ] Add unique canonical metadata and Open Graph data to every public route.
- [ ] Add generated `sitemap.xml`, `robots.txt`, favicons, and social imagery.
- [ ] Audit server/client boundaries, bundle size, static generation, image
  optimisation, and Core Web Vitals risks.
- [ ] Audit semantics, focus order, contrast, reduced motion, touch targets, and
  mobile layouts.
- [ ] Run lint, type checking, unit/component/end-to-end tests, and the final
  production build with no outstanding errors.
- [ ] Document environment and Vercel deployment steps.
- [ ] Connect the GitHub repository, deploy to Vercel, verify the production URL,
  and confirm automatic deployments (requires account access).
- [ ] Commit production-readiness changes and record the live URL in `README.md`.
