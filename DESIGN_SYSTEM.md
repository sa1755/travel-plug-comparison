# TravelPlug Design System

## Version

Version 1.1

---

# Implementation Specification

This section translates the design direction into enforceable product rules.
When a general example elsewhere in this document conflicts with this section,
use this specification.

## Core Tokens

### Brand and neutral colours

| Token | Value | Purpose |
| --- | --- | --- |
| Travel Blue | `#1A73E8` | Primary actions, links, selection, and navigation |
| Deep Blue | `#174EA6` | High-emphasis brand text and pressed states |
| Blue Soft | `#E8F0FE` | Selected and informative backgrounds |
| Canvas | `#F8FAFD` | Page background |
| Surface | `#FFFFFF` | Cards, header, and foreground surfaces |
| Surface Subtle | `#F1F5FB` | Grouped secondary content |
| Ink | `#162033` | Primary text |
| Muted Ink | `#5F6B7A` | Supporting text |
| Border | `#DCE3EC` | Default separation |
| Border Strong | `#C8D2DF` | Interactive boundaries |

Travel Blue identifies the product. It must never be used to mean “electrically
safe.” Compatibility meaning is reserved for the following semantic colours:

| Meaning | Strong | Soft |
| --- | --- | --- |
| Safe | `#137333` | `#E6F4EA` |
| Warning | `#A15C00` | `#FEF3C7` |
| Danger | `#C5221F` | `#FCE8E6` |

Every semantic state pairs colour with a label and, where useful, an icon.
The Version 1.1 safe green is slightly darker than the original token so small
status labels meet WCAG AA contrast against the safe background.

### Typography

- Use the application system sans stack until a locally served brand font is
  introduced. Do not add a render-blocking font request.
- Display headings use bold weight, tight tracking, and balanced wrapping.
- Section headings use bold weight and compact line height.
- Body copy uses regular weight, a minimum `1rem` size, and relaxed line height.
- Labels are concise and medium or semibold; all-caps is reserved for short
  wayfinding labels, never paragraphs.
- Long-form copy should remain between 45 and 70 characters per line.

### Spacing, shape, and elevation

- Use a four-pixel spacing rhythm.
- Minimum touch target: 44 by 44 pixels.
- Page content width: 72rem with 1rem mobile and 1.5rem desktop gutters.
- Section spacing: 4rem on mobile and 6rem on larger screens.
- Control radius: 0.75rem. Card radius: 1rem to 1.5rem. Pills may be fully round.
- Default cards use a border and little or no shadow. Elevation is reserved for
  the primary journey surface, menus, dialogs, and floating content.

### Interaction states

- Hover may change border, surface, or elevation but must not move essential
  controls unpredictably.
- Keyboard focus uses a visible two-pixel Travel Blue ring with clear offset.
- Disabled controls remain legible, communicate why they are unavailable, and
  cannot be the only form of error prevention.
- Loading preserves layout and explains progress for operations longer than a
  brief transition.
- Motion must respect `prefers-reduced-motion` and must not be required to
  understand state.

## Component Contract

- Buttons have one dominant primary style per view, action-led labels, and
  complete hover, focus, active, loading, and disabled states.
- Cards use consistent internal spacing and place their most important answer
  first. Decorative shadows do not communicate hierarchy by themselves.
- Country selectors use question labels, search-like input, flags as supporting
  identity, and full keyboard navigation.
- Comparison results lead with a plain-language conclusion, then progressively
  reveal plug, voltage, frequency, and device detail.
- Header navigation exposes only available destinations. Future features are not
  presented as active links.
- Empty and error states always provide a recovery action.

## Interactive Globe Boundary

The globe is a future optional exploration surface, not part of the current UI
foundation. It will be introduced only after the validated country data service
exists.

When implemented, the globe must:

- consume country information through the same read-only services as country and
  comparison pages;
- remain an isolated, dynamically loaded client component;
- provide an equivalent keyboard-accessible search or country-list experience;
- load progressively without delaying the primary comparison journey;
- support pointer, touch, keyboard, reduced-motion, and non-WebGL fallbacks;
- use the shared brand, surface, focus, and typography tokens; and
- emit country selection only, leaving comparison rules in the domain layer.

No globe library, map asset, canvas, WebGL code, simulated globe placeholder, or
globe-specific data model belongs in the application before that phase.

---

# Design Vision

TravelPlug should feel like:

**Google simplicity + premium travel experience**

The product should be:

- Clean
- Fast
- Trustworthy
- Easy to understand
- Visually calm
- Friendly for non-technical users

The user should never feel like they are reading an electrical engineering manual.

The experience should answer:

"I am travelling somewhere. What do I need?"

as quickly and clearly as possible.

---

# Brand Personality

TravelPlug is:

- Helpful
- Reliable
- Modern
- Intelligent
- Travel-focused
- Simple

The user should feel:

"I can trust this website before I travel."

---

# Design Principles

Follow the 8 Golden Rules of Interface Design.

---

# 1. Consistency

Everything must follow a unified system.

Maintain consistency across:

- Buttons
- Cards
- Forms
- Typography
- Colours
- Spacing
- Navigation
- Icons

Components should look and behave the same throughout the application.

---

# 2. Shortcuts for Frequent Users

Help returning users quickly access information.

Future features:

- Recently searched destinations
- Popular routes
- Saved trips
- Favourite countries

Examples:

UK → Japan

USA → France

Australia → Thailand

---

# 3. Informative Feedback

Every user action must create a clear response.

Examples:

When selecting a country:

- Highlight the country
- Show plug information
- Show voltage
- Show adapter requirements

Never leave the user wondering what happened.

---

# 4. Clear Completion

Every comparison must end with a simple conclusion.

The user should receive a final recommendation.

Example:

```
Your trip:

United Kingdom → Japan


You need:

✓ Plug adapter

✓ Phone charger should work

⚠ High-powered devices may need checking
```

---

# 5. Error Prevention

Prevent mistakes before they happen.

Examples:

Avoid:

"Select country"

Prefer:

"Where are you travelling from?"

"Where are you travelling to?"

Prevent invalid comparisons.

---

# 6. Easy Reversal

Users should always be able to:

- Change countries
- Swap locations
- Restart a search
- Return to previous pages

Example:

Button:

"⇄ Swap countries"

---

# 7. User Control

Users choose how they explore.

Provide:

Primary method:

Search/select countries

Secondary method:

Interactive globe exploration

Users should never be forced into one workflow.

---

# 8. Reduce Memory Load

Do not require users to understand technical electricity terms.

Avoid:

"IEC Type G socket with 230V 50Hz"

Prefer:

"Your plug will not fit. You need a Type G adapter."

Technical information can exist but should not overwhelm the main answer.

---

# User Experience Strategy

TravelPlug has two main experiences.

---

# Experience 1: Quick Answer

For users who already know where they are going.

Flow:

1. Select departure country
2. Select destination country
3. Receive recommendation

Goal:

Answer within seconds.

---

# Experience 2: Explore The World

For users browsing destinations.

Use an interactive globe.

The globe allows users to:

- Rotate the Earth
- Hover countries
- Select destinations
- Discover plug information

The globe should feel like exploration, not a complicated tool.

---

# Interactive Globe Concept

## Purpose

The globe is an exploration feature.

It should not replace the main comparison tool.

The main comparison tool remains the fastest option.

---

## Globe Behaviour

When hovering over a country:

Display:

- Country name
- Flag
- Plug type
- Voltage
- Frequency

Example:

```
🇯🇵 Japan

Plug:
Type A/B

Voltage:
100V

Adapter:
Usually required
```

---

## Globe Design

The globe should feel:

- Premium
- Smooth
- Lightweight
- Interactive

Avoid:

- Excessive animations
- Distracting effects
- Slow loading

---

# Visual Style

## Overall Feel

Inspired by:

- Google
- Google Maps
- Apple
- Modern travel applications

The interface should use:

- Large whitespace
- Clear hierarchy
- Simple layouts
- Minimal decoration

---

# Colour System

## Primary

Travel Blue

Used for:

- Main buttons
- Links
- Active states

---

## Success

Safe Green

Used for:

- Compatible devices
- No adapter needed
- Safe results

---

## Warning

Travel Amber

Used for:

- Check device compatibility
- Voltage differences

---

## Danger

Alert Red

Used for:

- Converter required
- Unsafe situations

---

## Neutral Colours

Use:

- White backgrounds
- Soft grey sections
- Dark text

Avoid overly saturated colours.

---

# Typography

Typography should feel:

- Modern
- Friendly
- Easy to scan

Recommended:

Primary font:

Inter or Geist

---

## Heading Style

Large:

Simple:

Confident:

Example:

"Know what plug you need before you fly."

---

## Body Text

Should be:

- Short
- Clear
- Human

Avoid long technical explanations.

---

# Layout Rules

Use:

- Large spacing
- Clear sections
- Strong visual hierarchy

Avoid:

- Crowded screens
- Dense tables
- Too much information at once

---

# Components

All components must follow this design system.

Required reusable components:

---

## Button

Characteristics:

- Rounded
- Clear action
- Strong contrast
- Comfortable size

Examples:

Compare

Search

Explore

---

## Cards

Used for:

- Countries
- Plug types
- Results
- Devices

Characteristics:

- Rounded corners
- Soft shadows
- Clear spacing

---

## Country Selector

Should feel like:

Google search.

Features:

- Search
- Autocomplete
- Flag display
- Recent choices

---

## Comparison Result Card

Must clearly show:

FROM → TO

Example:

```
🇬🇧 United Kingdom

↓

🇯🇵 Japan
```

Then:

Adapter recommendation.

---

# Responsive Design

Mobile-first.

The website must work perfectly on:

- Mobile phones
- Tablets
- Desktop

Priority:

1. Mobile usability
2. Desktop enhancement

---

# Accessibility

Follow accessibility best practices.

Requirements:

- Good colour contrast
- Keyboard navigation
- Screen-reader friendly labels
- Clear buttons
- No important information only shown by colour

---

# Animation Rules

Animations should:

- Guide attention
- Feel smooth
- Improve understanding

Use:

- Subtle transitions
- Hover effects
- Smooth loading states

Avoid:

- Excessive movement
- Distracting effects

---

# Future Design Features

Possible future additions:

- Trip dashboard
- Saved destinations
- Packing checklist
- eSIM recommendations
- Currency information
- Travel alerts

All future features must follow this design system.

---

# Final Design Goal

TravelPlug should feel like:

"Google Maps for travel electricity."

Simple enough for anyone.

Powerful enough for frequent travellers.

Beautiful enough that users trust it before their journey.
