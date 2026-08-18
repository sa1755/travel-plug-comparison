import Link from "next/link";
import { Code2 } from "lucide-react";

import { TrackedExternalLink } from "@/components/analytics/tracked-external-link";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-surface">
      <div className="page-container flex flex-col gap-6 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
            Clear plug, power, and device guidance across 242 supported destinations.
          </p>
          <p className="mt-2 max-w-lg text-xs leading-5 text-muted">
            Electrical data reviewed August 2026 against published international socket and power references. Always check your device label and local guidance.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-muted">
          <Link href="/" className="min-h-11 content-center hover:text-brand-strong">Home</Link>
          <Link href="/about" className="min-h-11 content-center hover:text-brand-strong">About</Link>
          <TrackedExternalLink
            href="https://github.com/sa1755/travel-plug-comparison"
            target="_blank"
            rel="noreferrer"
            eventName="github_link_clicked"
            eventProperties={{ location: "footer" }}
            className="inline-flex min-h-11 items-center gap-1.5 hover:text-brand-strong"
            aria-label="View TravelPlug on GitHub (opens in a new tab)"
          >
            <Code2 className="size-4" aria-hidden="true" /> GitHub
          </TrackedExternalLink>
          <Link href="/privacy" className="min-h-11 content-center hover:text-brand-strong">Privacy</Link>
          <a href="https://github.com/sa1755/travel-plug-comparison/blob/main/src/data/README.md" target="_blank" rel="noreferrer" className="min-h-11 content-center hover:text-brand-strong" aria-label="Electrical data sources and methodology (opens in a new tab)">Data sources</a>
          <a href="https://github.com/sa1755/travel-plug-comparison/blob/main/LICENSE" target="_blank" rel="noreferrer" className="min-h-11 content-center hover:text-brand-strong" aria-label="Apache 2.0 license (opens in a new tab)">License</a>
        </nav>
      </div>
    </footer>
  );
}
