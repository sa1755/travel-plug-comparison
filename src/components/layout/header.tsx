import Link from "next/link";

import { GlobalSearch } from "@/components/layout/global-search";
import { Logo } from "@/components/ui/logo";
import { getCatalogSearchEntries } from "@/services/search-service";

export function Header() {
  const searchEntries = getCatalogSearchEntries();

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
          <Link
            href="/#how-it-works"
            className="hidden min-h-11 items-center rounded-full px-4 text-sm font-semibold text-muted transition-colors hover:bg-surface-muted hover:text-foreground md:inline-flex"
          >
            How it works
          </Link>
          <Link
            href="/device-checker"
            className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-muted transition-colors hover:bg-surface-muted hover:text-foreground sm:px-4"
          >
            <span className="hidden sm:inline">Device checker</span>
            <span className="sm:hidden">Devices</span>
          </Link>
          <GlobalSearch entries={searchEntries} />
        </nav>
      </div>
    </header>
  );
}
