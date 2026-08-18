"use client";

import type { ComponentPropsWithoutRef } from "react";

import { trackEvent, type AnalyticsEventName, type AnalyticsProperties } from "@/lib/analytics";

interface TrackedExternalLinkProps extends ComponentPropsWithoutRef<"a"> {
  readonly eventName: AnalyticsEventName;
  readonly eventProperties?: AnalyticsProperties;
}

export function TrackedExternalLink({ eventName, eventProperties, onClick, ...props }: TrackedExternalLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackEvent(eventName, eventProperties);
        onClick?.(event);
      }}
    />
  );
}
