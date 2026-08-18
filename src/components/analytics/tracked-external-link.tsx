"use client";

import type { ComponentPropsWithoutRef } from "react";

import { trackEvent } from "@/lib/analytics";

interface TrackedExternalLinkProps extends ComponentPropsWithoutRef<"a"> {
  readonly eventName: string;
  readonly eventProperties?: Record<string, string | number | boolean | null>;
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
