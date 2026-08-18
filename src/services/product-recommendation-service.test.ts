import { describe, expect, it } from "vitest";

import { findAdapterRecommendations } from "@/services/product-recommendation-service";
import type { AdapterProduct } from "@/types";

const fixture = (overrides: Partial<AdapterProduct> = {}): AdapterProduct => ({
  id: "test-uk-to-japan",
  name: "Test adapter",
  description: "Test-only product record",
  retailer: "Test retailer",
  productUrl: "https://example.test/product",
  originPlugTypes: ["G"],
  destinationPlugTypes: ["A", "B"],
  active: true,
  priority: 10,
  ...overrides,
});

const query = {
  originCountry: "united-kingdom",
  destinationCountry: "japan",
  originPlugTypes: ["G"] as const,
  destinationPlugTypes: ["A", "B"] as const,
};

describe("adapter recommendations", () => {
  it("returns only active products that match both plug systems", () => {
    expect(findAdapterRecommendations(query, [
      fixture(),
      fixture({ id: "inactive", active: false }),
      fixture({ id: "wrong-origin", originPlugTypes: ["I"] }),
    ]).map(({ id }) => id)).toEqual(["test-uk-to-japan"]);
  });

  it("requires coverage of every origin plug type", () => {
    expect(findAdapterRecommendations({ ...query, originPlugTypes: ["C", "E"] }, [
      fixture({ id: "partial", originPlugTypes: ["C"] }),
      fixture({ id: "complete", originPlugTypes: ["C", "E"] }),
    ]).map(({ id }) => id)).toEqual(["complete"]);
  });

  it("requires coverage of every destination socket type", () => {
    expect(findAdapterRecommendations(query, [
      fixture({ id: "type-a-only", destinationPlugTypes: ["A"] }),
      fixture({ id: "type-b-only", destinationPlugTypes: ["B"] }),
      fixture({ id: "complete", destinationPlugTypes: ["A", "B"] }),
    ]).map(({ id }) => id)).toEqual(["complete"]);
  });

  it("honours route restrictions and priority", () => {
    expect(findAdapterRecommendations(query, [
      fixture({ id: "lower", priority: 1 }),
      fixture({ id: "higher", priority: 20, supportedOriginCountries: ["united-kingdom"], supportedDestinationCountries: ["japan"] }),
      fixture({ id: "wrong-origin-country", supportedOriginCountries: ["france"] }),
      fixture({ id: "france-only", supportedDestinationCountries: ["france"] }),
    ]).map(({ id }) => id)).toEqual(["higher", "lower"]);
  });

  it("keeps the public catalog empty until real products are configured", () => {
    expect(findAdapterRecommendations(query)).toEqual([]);
  });

  it("rejects unsafe URLs and affiliate links without programme disclosure", () => {
    expect(findAdapterRecommendations(query, [
      fixture({ id: "unsafe", productUrl: "http://example.test/product" }),
      fixture({ id: "undisclosed", affiliateUrl: "https://example.test/affiliate" }),
      fixture({
        id: "reviewed-affiliate",
        affiliateUrl: "https://example.test/affiliate",
        affiliateProgramme: "other",
        affiliateDisclosure: "Test-only affiliate disclosure.",
      }),
    ]).map(({ id }) => id)).toEqual(["reviewed-affiliate"]);
  });
});
