import { track } from "@vercel/analytics";

export type AnalyticsProperties = Record<string, string | number | boolean | null>;
export type AnalyticsEventName =
  | "landing_page_view"
  | "origin_country_selected"
  | "destination_country_selected"
  | "countries_swapped"
  | "comparison_started"
  | "comparison_completed"
  | "device_checker_opened"
  | "device_checked"
  | "adapter_recommendation_viewed"
  | "adapter_product_clicked"
  | "github_link_clicked"
  | "search_used"
  | "error_encountered";

export const GOOGLE_ANALYTICS_CONSENT_KEY = "travelplug-ga-consent";

export const isValidGoogleMeasurementId = (value: string | undefined) =>
  /^G-[A-Z0-9]+$/i.test(value?.trim() ?? "");

export function readGoogleAnalyticsConsent() {
  try {
    return localStorage.getItem(GOOGLE_ANALYTICS_CONSENT_KEY);
  } catch {
    return null;
  }
}

export function writeGoogleAnalyticsConsent(value: "accepted" | "declined") {
  try {
    localStorage.setItem(GOOGLE_ANALYTICS_CONSENT_KEY, value);
  } catch {
    // Storage can be unavailable in hardened or private browser contexts.
  }
}

export function clearGoogleAnalyticsConsent() {
  try {
    localStorage.removeItem(GOOGLE_ANALYTICS_CONSENT_KEY);
  } catch {
    // A blocked storage API must not prevent the preference UI from working.
  }
}

export function sanitizeAnalyticsUrl(url: string, origin: string) {
  const sanitized = new URL(url, origin);
  sanitized.search = "";
  sanitized.hash = "";
  return sanitized.toString();
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function analyticsAllowed() {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "false") return false;
  return typeof navigator === "undefined" || navigator.doNotTrack !== "1";
}

const googleAnalyticsAllowed = () =>
  typeof localStorage !== "undefined" && readGoogleAnalyticsConsent() === "accepted";

export function trackEvent(name: AnalyticsEventName, properties?: AnalyticsProperties) {
  if (!analyticsAllowed()) return;

  try {
    track(name, properties);
  } catch {
    // Vercel Analytics must never interrupt the product journey.
  }

  try {
    if (googleAnalyticsAllowed()) window.gtag?.("event", name, properties ?? {});
  } catch {
    // Optional Google Analytics must never interrupt the product journey.
  }
}

export function trackPageView(path: string) {
  if (!analyticsAllowed()) return;

  try {
    if (!googleAnalyticsAllowed()) return;
    window.gtag?.("event", "page_view", {
      page_location: `${window.location.origin}${path}`,
      page_path: path,
      page_title: document.title,
    });
  } catch {
    // Page measurement must never interrupt navigation.
  }
}
