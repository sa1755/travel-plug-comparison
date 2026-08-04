import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-t bg-surface">
      <div className="page-container flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <Logo />
        <p className="text-sm text-muted">
          Practical electrical guidance for international travellers.
        </p>
      </div>
    </footer>
  );
}
