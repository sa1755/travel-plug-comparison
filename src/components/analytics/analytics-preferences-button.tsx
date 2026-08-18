"use client";

import { openAnalyticsPreferences } from "@/components/analytics/analytics-provider";

export function AnalyticsPreferencesButton() {
  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return null;

  return (
    <button
      type="button"
      className="mt-4 inline-flex min-h-11 items-center rounded-full border border-border-strong px-4 font-semibold text-brand-strong"
      onClick={openAnalyticsPreferences}
    >
      Change analytics choice
    </button>
  );
}
