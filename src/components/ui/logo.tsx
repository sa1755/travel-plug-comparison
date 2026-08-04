import { Globe2 } from "lucide-react";

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-foreground">
      <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-white">
        <Globe2 className="size-4.5" strokeWidth={2.3} aria-hidden="true" />
      </span>
      Travel<span className="-ml-2 text-brand">Plug</span>
    </span>
  );
}
