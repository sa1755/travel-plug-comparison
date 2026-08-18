// @vitest-environment jsdom

import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const speedMock = vi.hoisted(() => vi.fn());

vi.mock("@vercel/speed-insights/next", () => ({
  SpeedInsights: (properties: { beforeSend?: (event: { url: string }) => { url: string } | null }) => {
    speedMock(properties);
    return null;
  },
}));

import { SpeedInsightsProvider } from "@/components/analytics/speed-insights-provider";

describe("Speed Insights provider", () => {
  beforeEach(() => {
    speedMock.mockClear();
    Object.defineProperty(navigator, "doNotTrack", { configurable: true, value: "0" });
  });

  afterEach(() => vi.unstubAllEnvs());

  it("sanitizes URLs and honours Do Not Track", () => {
    render(<SpeedInsightsProvider />);
    const beforeSend = speedMock.mock.calls[0]?.[0].beforeSend;

    expect(beforeSend?.({ url: "/compare/gb/jp?campaign=test#result" })).toEqual({
      url: "http://localhost:3000/compare/gb/jp",
    });

    Object.defineProperty(navigator, "doNotTrack", { configurable: true, value: "1" });
    expect(beforeSend?.({ url: "/country/japan" })).toBeNull();
  });

  it("does not render when analytics are disabled", () => {
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_ENABLED", "false");
    render(<SpeedInsightsProvider />);

    expect(speedMock).not.toHaveBeenCalled();
  });
});
