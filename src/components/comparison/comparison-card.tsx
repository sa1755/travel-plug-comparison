import type { ReactNode } from "react";

import { CompatibilityBadge } from "@/components/comparison/compatibility-badge";
import type { CompatibilityLevel } from "@/types";

interface ComparisonCardProps {
  readonly icon: ReactNode;
  readonly eyebrow: string;
  readonly title: string;
  readonly summary: string;
  readonly level: CompatibilityLevel;
  readonly children?: ReactNode;
}

export function ComparisonCard({
  icon,
  eyebrow,
  title,
  summary,
  level,
  children,
}: ComparisonCardProps) {
  return (
    <article className="rounded-3xl border border-border/90 bg-surface p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong">
          {icon}
        </span>
        <CompatibilityBadge level={level} />
      </div>
      <p className="section-label mt-6">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-bold tracking-tight">{title}</h2>
      <p className="mt-3 leading-7 text-muted">{summary}</p>
      {children ? <div className="mt-5 border-t pt-5">{children}</div> : null}
    </article>
  );
}
