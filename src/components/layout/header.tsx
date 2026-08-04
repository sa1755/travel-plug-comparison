import { PlaneTakeoff } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/ui/logo";

export function Header() {
  return (
    <header className="border-b bg-surface/95">
      <div className="page-container flex h-16 items-center justify-between sm:h-18">
        <Link
          href="/"
          className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          aria-label="TravelPlug home"
        >
          <Logo />
        </Link>
        <p className="hidden items-center gap-2 text-sm font-medium text-muted sm:flex">
          <PlaneTakeoff className="size-4 text-brand" aria-hidden="true" />
          Pack with confidence
        </p>
      </div>
    </header>
  );
}
