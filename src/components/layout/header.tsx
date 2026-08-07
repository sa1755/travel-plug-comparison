import { ShieldCheck, Smartphone } from "lucide-react";
import Link from "next/link";

import { GlobalSearch } from "@/components/layout/global-search";
import { Logo } from "@/components/ui/logo";
import { getCatalogSearchEntries } from "@/services/search-service";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-surface/90 backdrop-blur-xl">
      <div className="page-container flex h-16 items-center justify-between sm:h-18">
        <Link
          href="/"
          className="rounded-xl"
          aria-label="TravelPlug home"
        >
          <Logo />
        </Link>
        <nav aria-label="Primary navigation" className="flex items-center">
          <Link href="/#compare" className="hidden min-h-11 items-center rounded-full px-3 text-sm font-semibold text-muted hover:text-foreground sm:inline-flex sm:px-4">Compare</Link>
          <Link href="/?explore=globe" className="hidden min-h-11 items-center rounded-full px-3 text-sm font-semibold text-muted hover:text-foreground md:inline-flex sm:px-4">Globe view</Link>
          <Link href="/#safety" className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-muted hover:bg-surface-muted hover:text-foreground sm:px-4" aria-label="Power safety">
            <ShieldCheck className="size-4.5" aria-hidden="true" />
            <span className="hidden lg:inline">Safety</span>
          </Link>
          <Link href="/device-checker" className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-muted hover:bg-surface-muted hover:text-foreground sm:px-4" aria-label="Device checker">
            <Smartphone className="size-4.5" aria-hidden="true" />
            <span className="hidden sm:inline">Device checker</span>
          </Link>
          <GlobalSearch entries={getCatalogSearchEntries()} />
        </nav>
      </div>
    </header>
  );
}
