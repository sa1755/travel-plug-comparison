import { CircleCheck, CircleX, TriangleAlert } from "lucide-react";

import type { CompatibilityLevel } from "@/types";

const badgeConfig = {
  safe: {
    label: "Compatible",
    icon: CircleCheck,
    className: "bg-success-soft text-success",
  },
  warning: {
    label: "Check details",
    icon: TriangleAlert,
    className: "bg-warning-soft text-warning",
  },
  danger: {
    label: "Action needed",
    icon: CircleX,
    className: "bg-danger-soft text-danger",
  },
} as const;

interface CompatibilityBadgeProps {
  readonly level: CompatibilityLevel;
  readonly label?: string;
}

export function CompatibilityBadge({ level, label }: CompatibilityBadgeProps) {
  const config = badgeConfig[level];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${config.className}`}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {label ?? config.label}
    </span>
  );
}
