import { track } from "@vercel/analytics";

type AnalyticsProperties = Record<string, string | number | boolean | null>;

export function trackEvent(name: string, properties?: AnalyticsProperties) {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "false") return;
  if (typeof navigator !== "undefined" && navigator.doNotTrack === "1") return;

  try {
    track(name, properties);
  } catch {
    // Analytics must never interrupt the product journey.
  }
}
