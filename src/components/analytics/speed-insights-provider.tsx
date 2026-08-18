"use client";

import { SpeedInsights } from "@vercel/speed-insights/next";

import { analyticsAllowed, sanitizeAnalyticsUrl } from "@/lib/analytics";

export function SpeedInsightsProvider() {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "false") return null;

  return (
    <SpeedInsights
      beforeSend={(event) => analyticsAllowed()
        ? { ...event, url: sanitizeAnalyticsUrl(event.url, window.location.origin) }
        : null}
    />
  );
}
