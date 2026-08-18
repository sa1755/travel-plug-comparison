"use client";

import { Analytics } from "@vercel/analytics/next";

export function AnalyticsProvider() {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "false") return null;

  return (
    <Analytics
      beforeSend={(event) => {
        if (navigator.doNotTrack === "1") return null;

        const url = new URL(event.url, window.location.origin);
        url.search = "";
        url.hash = "";
        return { ...event, url: url.toString() };
      }}
    />
  );
}
