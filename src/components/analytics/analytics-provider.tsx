"use client";

import { Analytics } from "@vercel/analytics/next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

import {
  analyticsAllowed,
  clearGoogleAnalyticsConsent,
  isValidGoogleMeasurementId,
  readGoogleAnalyticsConsent,
  sanitizeAnalyticsUrl,
  trackEvent,
  trackPageView,
  writeGoogleAnalyticsConsent,
} from "@/lib/analytics";

const OPEN_PREFERENCES_EVENT = "travelplug-open-analytics-preferences";

type ConsentChoice = "accepted" | "declined" | "unknown";

export function AnalyticsProvider() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
  const hasGoogleAnalytics = isValidGoogleMeasurementId(measurementId);
  const pathname = usePathname();
  const [consent, setConsent] = useState<ConsentChoice>("unknown");
  const [googleReady, setGoogleReady] = useState(false);
  const landingTrackedRef = useRef(false);

  useEffect(() => {
    if (!analyticsAllowed()) {
      // Browser privacy preferences are available only after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConsent("declined");
      return;
    }
    const saved = readGoogleAnalyticsConsent();
    // Local consent is intentionally restored after hydration.
    setConsent(saved === "accepted" || saved === "declined" ? saved : "unknown");
  }, []);

  useEffect(() => {
    if (landingTrackedRef.current) return;
    landingTrackedRef.current = true;
    trackEvent("landing_page_view", { landing_path: window.location.pathname });
  }, []);

  useEffect(() => {
    const openPreferences = () => {
      clearGoogleAnalyticsConsent();
      window.gtag?.("consent", "update", { analytics_storage: "denied" });
      setConsent("unknown");
    };
    window.addEventListener(OPEN_PREFERENCES_EVENT, openPreferences);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, openPreferences);
  }, []);

  useEffect(() => {
    if (consent === "accepted" && googleReady) trackPageView(pathname);
  }, [consent, googleReady, pathname]);

  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "false") return null;

  const saveConsent = (choice: Exclude<ConsentChoice, "unknown">) => {
    writeGoogleAnalyticsConsent(choice);
    if (choice === "declined") {
      window.gtag?.("consent", "update", { analytics_storage: "denied" });
      document.cookie.split(";").forEach((cookie) => {
        const name = cookie.split("=")[0]?.trim();
        if (name === "_ga" || name?.startsWith("_ga_")) {
          document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
        }
      });
    }
    setConsent(choice);
  };

  const initializeGoogleAnalytics = () => {
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
    window.gtag("js", new Date());
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.gtag("config", measurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    setGoogleReady(true);
  };

  return (
    <>
      <Analytics
        beforeSend={(event) => {
          if (!analyticsAllowed()) return null;

          return { ...event, url: sanitizeAnalyticsUrl(event.url, window.location.origin) };
        }}
      />
      {hasGoogleAnalytics && consent === "accepted" ? (
        <Script
          id="travelplug-google-analytics"
          src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
          strategy="afterInteractive"
          onLoad={initializeGoogleAnalytics}
        />
      ) : null}
      {hasGoogleAnalytics && consent === "unknown" ? (
        <section className="analytics-consent" aria-labelledby="analytics-consent-title">
          <div>
            <h2 id="analytics-consent-title">Help improve TravelPlug?</h2>
            <p>Optional Google Analytics helps us understand journeys and sessions. Vercel’s cookie-free analytics remains active unless Do Not Track is enabled. <Link href="/privacy">Privacy details</Link></p>
          </div>
          <div className="analytics-consent__actions">
            <button type="button" onClick={() => saveConsent("declined")}>No thanks</button>
            <button type="button" className="analytics-consent__accept" onClick={() => saveConsent("accepted")}>Allow analytics</button>
          </div>
        </section>
      ) : null}
    </>
  );
}

export function openAnalyticsPreferences() {
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}
