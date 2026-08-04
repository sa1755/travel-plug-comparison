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
        </div>
        <p className="text-sm text-muted">Travel power, explained simply.</p>
      </div>
    </footer>
  );
}
