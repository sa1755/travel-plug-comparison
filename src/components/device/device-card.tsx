import { CompatibilityBadge } from "@/components/comparison/compatibility-badge";
import type { DeviceComparison } from "@/types";

interface DeviceCardProps {
  readonly result: DeviceComparison;
}

export function DeviceCard({ result }: DeviceCardProps) {
  return (
    <article className="rounded-2xl border border-border/90 bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="font-bold text-foreground">{result.deviceName}</h3>
        <CompatibilityBadge level={result.level} />
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{result.summary}</p>
      <details className="mt-4 border-t pt-4 text-sm">
        <summary className="cursor-pointer font-semibold text-brand-strong">
          What to check
        </summary>
        <p className="mt-2 leading-6 text-muted">{result.guidance}</p>
      </details>
    </article>
  );
}
