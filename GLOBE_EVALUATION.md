# Interactive globe evaluation

> 2026-08-04 update: the worldwide country service now satisfies the data gate.
> The globe is implemented as a dynamically loaded secondary explorer using
> `react-globe.gl`, Natural Earth geography through `world-atlas`, and GeoNames
> capitals/cities over 100,000. The country search/list remains the accessible
> equivalent and automatic rotation respects reduced motion.

## Current decision

The later worldwide product direction superseded the original Phase 4 deferral.
The globe is now available as an optional, dynamically loaded explorer; it does
not replace the primary searchable country comparison.

The catalog now contains 242 validated location records with coordinates.
Natural Earth boundary geometry and GeoNames city data are presentation inputs;
they do not alter or own the electrical model.

Global search, searchable country fields, and the globe sidebar remain the
equivalent accessible paths. The primary comparison works without graphics,
pointer input, motion, or WebGL.

## Readiness assessment

| Requirement | Current position | Gate before implementation |
| --- | --- | --- |
| Validated country service | Ready | Continue consuming serializable summaries from `country-service` only |
| Country selection contract | Ready | Globe may emit a country slug; it must not own comparison rules |
| Keyboard fallback | Ready | Global search and searchable country fields remain equivalent paths |
| Geographic data | Ready | Natural Earth geometry and reviewed country coordinates are isolated from electrical rules |
| Rendering fallback | Ready | Searchable country list remains available without using the canvas |
| Performance budget | Partially measured | Explorer is dynamically loaded; field performance should be monitored after deployment |
| Reduced motion | Contract defined | Disable automatic rotation and nonessential camera motion when requested |
| Touch and keyboard model | Ready | Dialog, Escape, close, searchable list, and focus return cover the equivalent selection path |

## Integration boundary

The globe remains an isolated, dynamically loaded client component. It receives
small serializable country summaries and emits only a country selection event.
URLs and `src/lib/comparison.ts` remain the source of truth for compatibility.

The explorer must continue to:

- adds no client JavaScript to users who never open the explorer;
- preserves country search and selection without WebGL;
- supports pointer, touch, keyboard, and reduced-motion behavior;
- does not delay the primary comparison form or page content;
- handles loading, unsupported-device, and rendering-failure states; and
- uses the existing design tokens without introducing a second visual system.

The performance and fallback decision should be revisited if city density,
geometry, or the rendering library materially changes.
