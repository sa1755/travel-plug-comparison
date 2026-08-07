import Link from "next/link";

import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-surface">
      <div className="page-container flex flex-col gap-6 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
            Clear plug, power, and device guidance for journeys worldwide.
          </p>
          <p className="mt-2 max-w-lg text-xs leading-5 text-muted">
            Electrical data reviewed August 2026 against published international socket and power references. Always check your device label and local guidance.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-muted">
          <Link href="/" className="min-h-11 content-center hover:text-brand-strong">Compare countries</Link>
          <Link href="/?explore=globe" className="min-h-11 content-center hover:text-brand-strong">Globe view</Link>
          <Link href="/device-checker" className="min-h-11 content-center hover:text-brand-strong">Device checker</Link>
          <Link href="/#safety" className="min-h-11 content-center hover:text-brand-strong">Power safety</Link>
          <a href="https://www.worldstandards.eu/electricity/plug-voltage-by-country/" rel="noreferrer" className="min-h-11 content-center hover:text-brand-strong">Data source</a>
        </nav>
      </div>
    </footer>
  );
}
