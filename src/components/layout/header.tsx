import Link from "next/link";

import { Logo } from "@/components/ui/logo";

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
        <nav aria-label="Primary navigation">
          <Link
            href="/#how-it-works"
            className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            How it works
          </Link>
        </nav>
      </div>
    </header>
  );
}
