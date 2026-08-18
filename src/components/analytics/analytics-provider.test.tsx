// @vitest-environment jsdom

import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GOOGLE_ANALYTICS_CONSENT_KEY } from "@/lib/analytics";

const providerMocks = vi.hoisted(() => ({
  script: vi.fn(),
  vercelTrack: vi.fn(),
}));

vi.mock("@vercel/analytics", () => ({ track: providerMocks.vercelTrack }));
vi.mock("@vercel/analytics/next", () => ({ Analytics: () => null }));
vi.mock("next/navigation", () => ({ usePathname: () => "/country/japan" }));
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("next/script", () => ({
  default: (properties: { onLoad: () => void; src: string }) => {
    providerMocks.script(properties);
    return <button type="button" onClick={properties.onLoad}>Load Google Analytics</button>;
  },
}));

import {
  AnalyticsProvider,
  openAnalyticsPreferences,
} from "@/components/analytics/analytics-provider";

const measurementIdVariable = "NEXT_PUBLIC_GA_MEASUREMENT_ID";
const testMeasurementId = "G-TEST123";
const originalMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

describe("Analytics provider consent", () => {
  beforeEach(() => {
    vi.stubEnv(measurementIdVariable, testMeasurementId);
    localStorage.clear();
    providerMocks.script.mockClear();
    providerMocks.vercelTrack.mockClear();
    window.dataLayer = [];
    window.gtag = undefined;
    document.cookie = "_ga=; Max-Age=0; Path=/";
    document.cookie = "_ga_TEST=; Max-Age=0; Path=/";
    document.cookie = "travelplug_test=; Max-Age=0; Path=/";
    Object.defineProperty(navigator, "doNotTrack", {
      configurable: true,
      value: "0",
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("does not load GA4 when consent is declined", async () => {
    const user = userEvent.setup();
    render(<AnalyticsProvider />);

    await user.click(screen.getByRole("button", { name: "No thanks" }));

    expect(localStorage.getItem(GOOGLE_ANALYTICS_CONSENT_KEY)).toBe("declined");
    expect(screen.queryByRole("button", { name: "Load Google Analytics" })).toBeNull();
  });

  it("restores stored accepted consent and records the current page", async () => {
    const user = userEvent.setup();
    localStorage.setItem(GOOGLE_ANALYTICS_CONSENT_KEY, "accepted");
    render(<AnalyticsProvider />);

    await user.click(await screen.findByRole("button", { name: "Load Google Analytics" }));

    await waitFor(() => {
      expect(window.dataLayer).toContainEqual([
        "config",
        testMeasurementId,
        expect.objectContaining({ send_page_view: false }),
      ]);
      expect(window.dataLayer).toContainEqual([
        "event",
        "page_view",
        expect.objectContaining({ page_path: "/country/japan" }),
      ]);
    });
  });

  it("restores stored declined consent without loading GA4", async () => {
    localStorage.setItem(GOOGLE_ANALYTICS_CONSENT_KEY, "declined");
    render(<AnalyticsProvider />);

    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: "Help improve TravelPlug?" })).toBeNull();
    });
    expect(providerMocks.script).not.toHaveBeenCalled();
  });

  it("reopens analytics preferences and clears the stored choice", async () => {
    localStorage.setItem(GOOGLE_ANALYTICS_CONSENT_KEY, "declined");
    render(<AnalyticsProvider />);
    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: "Help improve TravelPlug?" })).toBeNull();
    });

    act(() => openAnalyticsPreferences());

    expect(localStorage.getItem(GOOGLE_ANALYTICS_CONSENT_KEY)).toBeNull();
    expect(screen.getByRole("heading", { name: "Help improve TravelPlug?" })).toBeTruthy();
  });

  it("withdraws previously accepted consent before asking again", async () => {
    const user = userEvent.setup();
    localStorage.setItem(GOOGLE_ANALYTICS_CONSENT_KEY, "accepted");
    render(<AnalyticsProvider />);
    await user.click(await screen.findByRole("button", { name: "Load Google Analytics" }));

    act(() => openAnalyticsPreferences());

    expect(window.dataLayer).toContainEqual([
      "consent",
      "update",
      { analytics_storage: "denied" },
    ]);
    expect(screen.queryByRole("button", { name: "Load Google Analytics" })).toBeNull();
    expect(screen.getByRole("heading", { name: "Help improve TravelPlug?" })).toBeTruthy();
  });

  it("honours Do Not Track even when accepted consent was stored", async () => {
    localStorage.setItem(GOOGLE_ANALYTICS_CONSENT_KEY, "accepted");
    Object.defineProperty(navigator, "doNotTrack", {
      configurable: true,
      value: "1",
    });
    render(<AnalyticsProvider />);

    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: "Help improve TravelPlug?" })).toBeNull();
    });
    expect(providerMocks.script).not.toHaveBeenCalled();
    expect(providerMocks.vercelTrack).not.toHaveBeenCalled();
  });

  it.each([undefined, "UA-1234-1", "not-a-measurement-id"])(
    "omits GA4 for a missing or invalid measurement ID (%s)",
    async (measurementId) => {
      vi.stubEnv(measurementIdVariable, measurementId);
      render(<AnalyticsProvider />);

      await waitFor(() => {
        expect(screen.queryByRole("heading", { name: "Help improve TravelPlug?" })).toBeNull();
      });
      expect(providerMocks.script).not.toHaveBeenCalled();
    },
  );

  it("removes GA cookies while leaving unrelated cookies intact", async () => {
    const user = userEvent.setup();
    document.cookie = "_ga=test-client; Path=/";
    document.cookie = "_ga_TEST=test-session; Path=/";
    document.cookie = "travelplug_test=keep; Path=/";
    render(<AnalyticsProvider />);

    await user.click(screen.getByRole("button", { name: "No thanks" }));

    expect(document.cookie).not.toContain("_ga=");
    expect(document.cookie).not.toContain("_ga_TEST=");
    expect(document.cookie).toContain("travelplug_test=keep");
  });

  it("restores environment variables after temporary test overrides", () => {
    expect(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID).toBe(testMeasurementId);

    vi.unstubAllEnvs();

    expect(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID).toBe(originalMeasurementId);
  });
});
