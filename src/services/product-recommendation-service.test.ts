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

  it("honours destination restrictions and priority", () => {
    expect(findAdapterRecommendations(query, [
      fixture({ id: "lower", priority: 1 }),
      fixture({ id: "higher", priority: 20, supportedCountries: ["japan"] }),
      fixture({ id: "france-only", supportedCountries: ["france"] }),
    ]).map(({ id }) => id)).toEqual(["higher", "lower"]);
  });

  it("keeps the public catalog empty until real products are configured", () => {
    expect(findAdapterRecommendations(query)).toEqual([]);
  });
});
