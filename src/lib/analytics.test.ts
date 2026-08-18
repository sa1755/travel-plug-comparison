// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";

const { vercelTrack } = vi.hoisted(() => ({ vercelTrack: vi.fn() }));

vi.mock("@vercel/analytics", () => ({ track: vercelTrack }));

import {
  GOOGLE_ANALYTICS_CONSENT_KEY,
  trackEvent,
  trackPageView,
} from "@/lib/analytics";

describe("analytics", () => {
  beforeEach(() => {
    vercelTrack.mockClear();
    localStorage.clear();
    window.gtag = vi.fn();
    Object.defineProperty(navigator, "doNotTrack", {
      configurable: true,
      value: "0",
    });
  });

  it("sends typed product events to Vercel without requiring Google consent", () => {
    trackEvent("comparison_completed", {
      origin_country: "GB",
      destination_country: "JP",
    });

    expect(vercelTrack).toHaveBeenCalledWith("comparison_completed", {
      origin_country: "GB",
      destination_country: "JP",
    });
    expect(window.gtag).not.toHaveBeenCalled();
  });

  it("sends Google events and page views only after consent", () => {
    localStorage.setItem(GOOGLE_ANALYTICS_CONSENT_KEY, "accepted");

    trackEvent("search_used", { result_kind: "country" });
    trackPageView("/country/japan");

    expect(window.gtag).toHaveBeenCalledWith("event", "search_used", {
      result_kind: "country",
    });
    expect(window.gtag).toHaveBeenCalledWith(
      "event",
      "page_view",
      expect.objectContaining({ page_path: "/country/japan" }),
    );
  });

  it("honours the browser Do Not Track preference", () => {
    Object.defineProperty(navigator, "doNotTrack", {
      configurable: true,
      value: "1",
    });

    trackEvent("landing_page_view");

    expect(vercelTrack).not.toHaveBeenCalled();
    expect(window.gtag).not.toHaveBeenCalled();
  });
});
