# Interactive globe evaluation

## Phase 4 decision

The interactive globe is deferred. No rendering library has been selected and
no globe code, map asset, coordinate model, canvas, WebGL surface, or simulated
placeholder has been added.

The globe could become a useful secondary country-discovery surface, but it is
not yet justified as a production dependency. The current catalog contains 17
validated electrical records but deliberately has no geographic coordinates or
boundary geometry. Introducing a renderer now would make the visual technology,
rather than the user journey and validated data, drive the model.

Phase 4 instead establishes the required accessible equivalent: global search
over the validated country and plug services. The primary comparison flow also
remains fully usable without graphics, pointer input, motion, or WebGL.

## Readiness assessment

| Requirement | Current position | Gate before implementation |
| --- | --- | --- |
| Validated country service | Ready | Continue consuming serializable summaries from `country-service` only |
| Country selection contract | Ready | Globe may emit a country slug; it must not own comparison rules |
| Keyboard fallback | Ready | Global search and native country selectors must remain equivalent paths |
| Geographic data | Not ready | Add separately validated coordinates or geometry without changing electrical records |
| Rendering fallback | Not ready | Define a non-WebGL country list and failure state before library selection |
| Performance budget | Not measured | Compare candidate libraries by compressed client cost, load isolation, and mid-tier mobile interaction |
| Reduced motion | Contract defined | Disable automatic rotation and nonessential camera motion when requested |
| Touch and keyboard model | Not designed | Prototype focus order, country activation, zoom, and escape behavior first |

## Future integration boundary

Any future implementation must be an isolated, dynamically loaded client
component. A server route will obtain a small serializable country summary from
the existing service and pass it into the island. The island may emit only a
country selection event. URLs and `src/lib/comparison.ts` remain the source of
truth for travel compatibility.

A rendering library can be selected only after an accessible interaction
prototype and a measured comparison demonstrate that it:

- adds no client JavaScript to users who never open the explorer;
- preserves country search and selection without WebGL;
- supports pointer, touch, keyboard, and reduced-motion behavior;
- does not delay the primary comparison form or page content;
- handles loading, unsupported-device, and rendering-failure states; and
- uses the existing design tokens without introducing a second visual system.

This decision should be revisited when catalog coverage and geographic data make
spatial exploration materially more useful than search.
