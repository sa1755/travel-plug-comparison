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

## Phase 1A — Visual identity refinement

- [x] Approve Google-style simplicity and premium travel as the product's visual
  direction.
- [x] Add the design-system implementation contract and separate Travel Blue
  branding from compatibility colours.
- [x] Refine the global tokens, shared shell, brand mark, and static homepage.
- [x] Document the future globe boundary without adding globe code or data.
- [x] Pass lint, type checking, and a production build.
- [x] Commit the visual-foundation refinement before Phase 2 begins.

## Phase 2 — Data

- [x] Define plug, country, device, severity, and comparison TypeScript models.
- [x] Define Zod schemas and parse every version-controlled data source at its
  service boundary.
- [x] Add all 17 initial countries with codes, slugs, flags, sockets, nominal
  voltage, frequencies, and concise travel advice.
- [x] Add plug types A through O with slugs, descriptions, technical details,
  stable future image keys, and derived country relationships. Type O extends
  the original brief so Thailand is represented accurately.
- [x] Add device profiles for the eight specified device categories.
- [x] Implement immutable lookup, filtering, cross-reference, and static-route
  utilities.
- [x] Add integrity tests for duplicate identities, invalid references, missing
  required records, and service lookups.
- [x] Pass the complete Phase 2 quality gate and commit the data milestone.

## Phase 3 — Main product

- [x] Build an accessible country selector and validated comparison form.
- [x] Keep selected countries in the shareable comparison URL.
- [x] Implement and document pure plug, voltage, and frequency comparison rules.
- [x] Add severity badges, comparison cards, plug cards, recommendation summary,
  and device-warning presentation.
- [x] Complete homepage “How it works”, adapter education, popular destinations,
  and travel tips sections.
- [x] Implement `/compare/[from]/[to]` with metadata, country identity, complete
  findings, invalid-route handling, and a path to start another comparison.
- [x] Test all domain rule branches and representative comparison journeys.
- [x] Pass the complete Phase 3 quality gate and commit the main product.

## Phase 4 — Expansion

- [x] Implement `/country/[country]` with plug details, power information, travel
  advice, and compatible-country links.
- [x] Implement `/plug/[type]` with imagery, description, technical facts, and
  countries using the plug.
- [x] Implement accessible global search across countries and plug types.
- [x] Evaluate the optional interactive globe against the validated country
  service, accessibility fallback, and performance budget before selecting a
  rendering library.
- [x] Implement `/device-checker` for all specified device profiles, with clear
  device-label caveats.
- [x] Add loading, empty, validation, and not-found states where applicable.
- [x] Test search, detail routes, the device checker, keyboard use, and responsive
  layouts.
- [x] Pass the complete Phase 4 quality gate and commit the expansion milestone.

## Phase 5 — Production

- [x] Add unique canonical metadata and Open Graph data to every public route.
- [x] Add generated `sitemap.xml`, `robots.txt`, favicons, and social imagery.
- [x] Audit server/client boundaries, bundle size, static generation, image
  optimisation, and Core Web Vitals risks.
- [x] Audit semantics, focus order, contrast, reduced motion, touch targets, and
  mobile layouts.
- [x] Run lint, type checking, unit/component/end-to-end tests, and the final
  production build with no outstanding errors.
- [x] Document environment and Vercel deployment steps.
- [~] Connect the GitHub repository, deploy to Vercel, verify the production URL,
  and confirm automatic deployments (requires account access).
- [x] Commit production-readiness changes and record the live URL in `README.md`.

## Phase 6 — Worldwide plug-first redesign

- [x] Approve the warm mid-century identity and plug-first hierarchy.
- [x] Replace the content-heavy homepage with the immediate two-location journey.
- [x] Add explicit location, approximate fallback, and local Change/Forget memory.
- [x] Expand the validated catalog from 17 to 242 inhabited locations.
- [x] Add a dynamically loaded globe with major-city labels and list fallback.
- [x] Bound static generation while preserving every valid comparison URL.
- [x] Pass lint, type checking, tests, and a production build.

## Phase 7 — Production-readiness sprint

- [x] Complete independent engineering, UI, UX, QA, and release reviews.
- [x] Make comparison routes answer-first with explicit adapter and voltage actions.
- [x] Add eight immediate device outcomes, including smartwatch guidance.
- [x] Prevent same-country state and preserve answer context while editing.
- [x] Add searchable country fields and expose global search/device checking.
- [x] Align semantic result colours, responsive cards, route CTAs, and brand artwork.
- [x] Add WebSite structured data and reconcile release documentation.
- [x] Complete the final quality gate and release-manager approval.

## Phase 8 — Public open-source launch

- [x] Update the homepage and social messaging for the public launch.
- [x] Add privacy-conscious Vercel Web Analytics and documented product events.
- [x] Add About, GitHub, Privacy, and Apache 2.0 license links to the website.
- [x] Prepare the repository README and Apache License 2.0 presentation.
- [x] Complete the final quality gate, release commit, push, and production verification.

## Phase 9 — Analytics, monetisation readiness, and globe refinement

- [x] Replace the decorative hero icon with a responsive animated desk globe.
- [x] Add Vercel Web Analytics, Speed Insights, typed product events, and an
  optional consent-gated GA4 integration.
- [x] Add a deliberately empty affiliate catalog, product service boundary,
  sponsored-link safeguards, disclosures, and test-only fixtures.
- [x] Correct ambiguous voltage and Type C compatibility outcomes, expand public
  source/attribution notes, and strengthen privacy documentation.
- [x] Fix light-theme label contrast, mobile search naming, globe list access,
  reduced-motion behaviour, and WebGL failure handling.
- [x] Add desktop/mobile Playwright journeys and a GitHub Actions quality gate.
- [x] Push the final refinement commit and verify the production deployment.
