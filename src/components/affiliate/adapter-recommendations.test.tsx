// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { JourneyCountry } from "@/components/comparison/travel-plug-journey";
import type { AdapterProduct } from "@/types";

const trackEventMock = vi.hoisted(() => vi.fn());
const products: readonly AdapterProduct[] = [{
  id: "test-reviewed-adapter",
  name: "Test reviewed adapter",
  description: "A test-only adapter used to verify the recommendation UI.",
  retailer: "Test retailer",
  productUrl: "https://example.test/product",
  affiliateUrl: "https://example.test/affiliate",
  affiliateProgramme: "other",
  affiliateDisclosure: "Test retailer may pay TravelPlug a commission on qualifying purchases.",
  originPlugTypes: ["G"],
  destinationPlugTypes: ["A", "B"],
  active: true,
  priority: 10,
}, {
  id: "test-amazon-adapter",
  name: "Test Amazon adapter",
  description: "A second test-only adapter for disclosure association.",
  retailer: "Amazon test storefront",
  productUrl: "https://amazon.example.test/product",
  affiliateUrl: "https://amazon.example.test/affiliate",
  affiliateProgramme: "amazon-associates",
  affiliateDisclosure: "As an Amazon Associate, TravelPlug may earn from qualifying purchases.",
  originPlugTypes: ["G"],
  destinationPlugTypes: ["A", "B"],
  active: true,
  priority: 5,
}];

vi.mock("@/lib/analytics", () => ({ trackEvent: trackEventMock }));
vi.mock("@/services/product-recommendation-service", () => ({
  findAdapterRecommendations: () => products,
}));

import { AdapterRecommendations } from "@/components/affiliate/adapter-recommendations";

const country = (overrides: Partial<JourneyCountry>): JourneyCountry => ({
  name: "United Kingdom",
  slug: "united-kingdom",
  code: "GB",
  numericCode: "826",
  flag: "🇬🇧",
  plugTypes: ["G"],
  voltages: [230],
  frequencies: [50],
  coordinates: [54, -2],
  aliases: [],
  ...overrides,
});

describe("adapter recommendations", () => {
  beforeEach(() => trackEventMock.mockClear());

  it("keeps each retailer disclosure beside its own affiliate link", async () => {
    render(
      <AdapterRecommendations
        origin={country({})}
        destination={country({
          name: "Japan",
          slug: "japan",
          code: "JP",
          numericCode: "392",
          flag: "🇯🇵",
          plugTypes: ["A", "B"],
          voltages: [100],
          frequencies: [50, 60],
          coordinates: [36, 138],
        })}
      />,
    );

    const retailerLink = screen.getByRole("link", { name: /View Test reviewed adapter/ });
    const amazonLink = screen.getByRole("link", { name: /View Test Amazon adapter/ });
    const retailerCard = retailerLink.closest("article");
    const amazonCard = amazonLink.closest("article");

    expect(retailerCard).toBeTruthy();
    expect(amazonCard).toBeTruthy();
    expect(retailerLink.getAttribute("href")).toBe("https://example.test/affiliate");
    expect(retailerLink.getAttribute("rel")).toContain("sponsored");
    expect(within(retailerCard!).getByText(/Test retailer may pay TravelPlug/)).toBeTruthy();
    expect(within(retailerCard!).queryByText(/As an Amazon Associate/)).toBeNull();
    expect(within(amazonCard!).getByText(/As an Amazon Associate/)).toBeTruthy();
    expect(within(amazonCard!).queryByText(/Test retailer may pay TravelPlug/)).toBeNull();
    expect(screen.getAllByText(/Affiliate disclosure:/)).toHaveLength(2);

    await waitFor(() => expect(trackEventMock).toHaveBeenCalledWith(
      "adapter_recommendation_viewed",
      expect.objectContaining({ product_id: products[0].id, retailer: products[0].retailer }),
    ));

    fireEvent.click(retailerLink);
    expect(trackEventMock).toHaveBeenCalledWith(
      "adapter_product_clicked",
      expect.objectContaining({ product_id: products[0].id, retailer: products[0].retailer }),
    );
  });
});
