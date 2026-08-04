# TravelPlug - International Travel Socket & Power Compatibility Website

## Project Mission

Build a complete, production-ready website that helps international travellers understand electrical compatibility between their current country and their travel destination.

The website should answer:

**"I am travelling from one country to another. Will my devices work, and what do I need to bring?"**

The goal is to make electrical travel information simple, visual, and easy to understand.

---

# Role

Act as a senior full-stack software engineer responsible for building this entire application.

You are responsible for:

- Planning the architecture
- Writing clean production-quality code
- Creating reusable components
- Testing functionality
- Fixing errors
- Preparing the application for deployment
- Ensuring the final website is live and accessible

Do not create temporary solutions.

Build this as a scalable product that can grow in the future.

---

# Product Name

TravelPlug

---

# Main Problem

Travellers often do not know:

- What socket type their destination uses
- Whether their charger fits
- Whether their devices support the local voltage
- Whether they need a travel adapter
- Whether they need a voltage converter

Existing websites usually provide only technical information.

This website should provide a simple answer:

"You are travelling from X to Y. Here is exactly what you need."

---

# Target Users

The website is designed for:

- Holiday travellers
- Business travellers
- Students studying abroad
- Digital nomads
- International workers

---

# Core User Journey

## Approved 2026 product direction

The homepage begins with an explicit “Use my location” option and a manual home
country selector. It immediately shows the home plug type beside the selected
destination plug type, followed by one concise “Bring…” recommendation. The
catalog covers 242 inhabited countries and territories and all plug types A–O.

An optional full-screen globe supports visual destination selection, country
hover labels, and city labels limited to capitals or cities of 100,000+ people.
Search/list selection remains equivalent and accessible. The visual identity is
warm, sleek mid-century modern: cream, walnut, terracotta, olive, and blue actions.
The UI targets WCAG 2.2 AA and applies the eight golden interface-design rules.

## Step 1

User visits the homepage.

They see:

- Clear headline
- Explanation
- Country comparison tool

---

## Step 2

User selects:

Current location:

Example:

United Kingdom

Destination:

Example:

Japan

---

## Step 3

The website compares:

- Plug/socket types
- Voltage
- Frequency
- Device compatibility

---

## Step 4

The user receives a simple recommendation:

Example:

"Travelling from the UK to Japan"

Result:

✅ Plug adapter required

⚠ Voltage difference exists

✅ Phone chargers should work

⚠ Hair dryers may require a converter

---

# Technology Stack

Build using:

## Frontend

- Next.js latest version
- React
- TypeScript
- App Router
- Tailwind CSS

---

## Libraries

Use:

- Lucide React for icons
- Framer Motion for animations
- React Hook Form where needed
- Zod for validation

---

# Development Principles

Follow:

- Clean architecture
- Reusable components
- Type safety
- Good naming conventions
- Maintainable code
- Modern Next.js best practices

Avoid:

- Duplicate code
- Hardcoded repeated values
- Large components
- Poor folder organisation

---

# Project Structure

Use:

```
src/

app/

components/

components/ui/

components/country/

components/comparison/

components/device/

data/

lib/

services/

types/

utils/

hooks/

styles/

```

---

# Main Features

## Feature 1 - Homepage

Create:

```
/
```

The homepage should include:

Hero section:

Title:

"Know what plug you need before you fly."

Subtitle:

"Compare sockets, voltage and device compatibility between countries."

Main tool:

- Current country selector
- Destination selector
- Compare button

Additional sections:

- How it works
- Why adapters matter
- Popular destinations
- Travel tips

---

# Feature 2 - Country Comparison Engine

Create a comparison system.

When two countries are selected calculate:

## Plug Compatibility

Compare:

Example:

United Kingdom:

Type G

Japan:

Type A/B


Result:

Adapter required.

---

## Voltage Compatibility

Compare:

Example:

UK:

230V

Japan:

100V


Display:

Green:

Safe

Yellow:

Check device

Red:

Converter required

---

## Frequency Compatibility

Compare:

Example:

50Hz vs 60Hz


---

# Feature 3 - Comparison Results Page

Create:

```
/compare/[from]/[to]
```

Example:

```
/compare/united-kingdom/japan
```

Display:

- Country flags
- Plug comparison
- Voltage comparison
- Frequency comparison
- Adapter recommendation
- Device warnings

---

# Feature 4 - Country Pages

Create:

```
/country/[country]
```

Example:

```
/country/japan
```

Each country page contains:

- Country name
- Flag
- Plug types
- Voltage
- Frequency
- Travel advice
- Compatible countries

---

# Feature 5 - Plug Type Pages

Create:

```
/plug/[type]
```

Example:

```
/plug/type-g
```

Each page includes:

- Plug image
- Description
- Countries using it
- Technical information

Support:

Type A
Type B
Type C
Type D
Type E
Type F
Type G
Type H
Type I
Type J
Type K
Type L
Type M
Type N

---

# Feature 6 - Device Compatibility Checker

Create:

```
/device-checker
```

Users can select:

- Phone charger
- Laptop
- Camera charger
- Hair dryer
- Hair straightener
- Electric toothbrush
- Gaming console
- CPAP machine

The system explains:

Example:

Phone:

Usually works worldwide.

Hair dryer:

May require voltage converter.

---

# Feature 7 - Search

Create global search.

Users can search:

- Countries
- Plug types

Example:

Search:

Japan

Returns:

Japan country page.

---

# Data System

Create structured data files.

Location:

```
src/data/
```

---

Create:

```
countries.json
```

Example:

```json
{
"name":"Japan",
"slug":"japan",
"code":"JP",
"flag":"🇯🇵",
"voltage":100,
"frequency":[50,60],
"plugTypes":["A","B"]
}
```

---

Create:

```
plugs.json
```

Example:

```json
{
"type":"G",
"description":"British three pin plug",
"countries":["United Kingdom","Singapore"]
}
```

---

# Initial Countries

Include:

- United Kingdom
- United States
- Canada
- Australia
- New Zealand
- Japan
- China
- India
- Thailand
- Singapore
- France
- Germany
- Spain
- Italy
- Brazil
- UAE
- South Africa

Architecture should allow adding all countries later.

---

# UI Requirements

The website should feel:

- Modern
- Premium
- Trustworthy
- Simple

Design:

- Mobile first
- Responsive
- Clean cards
- Rounded corners
- Good spacing
- Clear colours

Use:

Green = safe

Yellow = warning

Red = danger

---

# Required Components

Create reusable components:

## CountrySelector

Allows selecting countries.

---

## ComparisonCard

Displays comparison information.

---

## PlugCard

Displays plug information.

---

## CompatibilityBadge

Shows:

Safe

Warning

Danger

---

## DeviceCard

Displays device compatibility.

---

## Header

Navigation.

---

## Footer

Website links.

---

# SEO Requirements

Every page must include:

- Metadata
- Title
- Description
- OpenGraph information

Create:

- sitemap.xml
- robots.txt

Country pages should be search-engine friendly.

Example:

Title:

"UK to Japan Plug Adapter Guide"

---

# Performance Requirements

The website must:

- Load quickly
- Work well on mobile
- Use optimized assets
- Avoid unnecessary client components

---

# Testing Requirements

Before completion run:

```
npm run lint
```

and:

```
npm run build
```

Both must succeed.

Test:

- Homepage
- Country selection
- Comparison logic
- Country pages
- Plug pages
- Search
- Device checker
- Mobile layout

---

# Deployment Requirements

Deploy using:

Vercel

Requirements:

- Connect GitHub repository
- Enable automatic deployment
- Create production URL
- Verify website works online

---

# Development Phases

## Phase 1 - Foundation

Complete:

- Review repository
- Setup application
- Create folders
- Configure styling
- Create base layout


## Phase 2 - Data

Complete:

- Country database
- Plug database
- TypeScript types
- Data utilities


## Phase 3 - Main Product

Complete:

- Homepage
- Country selectors
- Comparison engine
- Results page


## Phase 4 - Expansion

Complete:

- Country pages
- Plug pages
- Search
- Device checker


## Phase 5 - Production

Complete:

- SEO
- Testing
- Performance improvements
- Deployment


---

# Final Definition Of Done

The project is complete only when:

✅ Website runs locally

✅ Website is deployed publicly

✅ GitHub repository is updated

✅ Users can compare countries

✅ Users know what adapter they need

✅ Device compatibility works

✅ SEO is implemented

✅ Mobile experience works

✅ Production build succeeds

✅ No errors remain

---

# Important Instructions

Before coding:

1. Inspect the existing repository.
2. Create a development plan.
3. Explain the plan.
4. Complete one phase at a time.
5. Test after every phase.
6. Commit changes with clear Git messages.
7. Do not move to the next phase without confirming the previous phase works.
