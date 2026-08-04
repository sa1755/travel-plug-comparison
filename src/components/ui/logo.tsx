import { Globe2 } from "lucide-react";

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5 text-lg font-bold tracking-[-0.025em] text-foreground">
      <span className="flex size-9 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
        <Globe2 className="size-5" strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span>
        Travel<span className="text-brand">Plug</span>
      </span>
    </span>
  );
}
