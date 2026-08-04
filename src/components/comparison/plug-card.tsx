import { PlugZap } from "lucide-react";

import type { PlugRecord } from "@/services/plug-service";

interface PlugCardProps {
  readonly countryName: string;
  readonly flag: string;
  readonly plugs: readonly PlugRecord[];
}

export function PlugCard({ countryName, flag, plugs }: PlugCardProps) {
  return (
    <article className="rounded-3xl border border-border/90 bg-surface p-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden="true">
          {flag}
        </span>
        <div>
          <p className="text-sm font-medium text-muted">Sockets in</p>
          <h3 className="font-bold text-foreground">{countryName}</h3>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {plugs.map((plug) => (
          <span
            key={plug.type}
            className="inline-flex items-center gap-2 rounded-2xl bg-surface-muted px-4 py-3 font-bold text-foreground"
            title={plug.description}
          >
            <PlugZap className="size-4 text-brand" aria-hidden="true" />
            Type {plug.type}
          </span>
        ))}
      </div>
    </article>
  );
}
