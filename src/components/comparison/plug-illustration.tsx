import type { PlugType } from "@/types";

interface PlugIllustrationProps {
  readonly type: PlugType;
  readonly className?: string;
}

const pinLayouts: Readonly<Record<PlugType, readonly [number, number][]>> = {
  A: [[38, 43], [62, 43]],
  B: [[38, 39], [62, 39], [50, 65]],
  C: [[38, 50], [62, 50]],
  D: [[50, 31], [35, 62], [65, 62]],
  E: [[38, 50], [62, 50]],
  F: [[38, 50], [62, 50]],
  G: [[50, 30], [35, 61], [65, 61]],
  H: [[50, 31], [35, 62], [65, 62]],
  I: [[38, 43], [62, 43], [50, 66]],
  J: [[38, 43], [62, 43], [50, 62]],
  K: [[38, 43], [62, 43], [50, 66]],
  L: [[30, 50], [50, 50], [70, 50]],
  M: [[50, 27], [32, 65], [68, 65]],
  N: [[38, 43], [62, 43], [50, 63]],
  O: [[38, 43], [62, 43], [50, 63]],
};

const flatPinTypes = new Set<PlugType>(["A", "B", "G", "I"]);

export function PlugIllustration({ type, className = "size-44" }: PlugIllustrationProps) {
  const isFlat = flatPinTypes.has(type);

  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={`Simplified Type ${type} plug diagram`}
      className={className}
    >
      <circle cx="50" cy="50" r="43" fill="var(--brand-faint)" />
      <circle cx="50" cy="50" r="34" fill="var(--surface)" stroke="var(--border-strong)" />
      {type === "F" ? (
        <path d="M18 37h8M18 63h8M74 37h8M74 63h8" stroke="var(--brand)" strokeWidth="4" />
      ) : null}
      {type === "E" ? <circle cx="50" cy="20" r="4" fill="var(--brand)" /> : null}
      {pinLayouts[type].map(([x, y], index) =>
        isFlat ? (
          <rect
            key={`${x}-${y}`}
            x={x - 3.5}
            y={y - 9}
            width="7"
            height="18"
            rx="2"
            fill={index === 2 ? "var(--brand)" : "var(--foreground)"}
            transform={type === "I" && index < 2 ? `rotate(${index === 0 ? -28 : 28} ${x} ${y})` : undefined}
          />
        ) : (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r={type === "M" ? 6 : 5}
            fill={index === 2 ? "var(--brand)" : "var(--foreground)"}
          />
        ),
      )}
      <text x="50" y="93" textAnchor="middle" fontSize="8" fontWeight="700" fill="var(--brand-strong)">
        TYPE {type}
      </text>
    </svg>
  );
}
