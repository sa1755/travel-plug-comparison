import { describe, expect, it } from "vitest";

import {
  comparisonFormSchema,
  countriesSchema,
  countrySchema,
  plugSchema,
} from "@/lib/schemas";

const validCountry = {
  name: "Example Country",
  slug: "example-country",
  code: "EX",
  flag: "🏳️",
  aliases: [],
  voltages: [230],
  frequencies: [50],
  plugTypes: ["G"],
  travelAdvice: "Check both the socket and the device rating before connecting power.",
} as const;

describe("data schemas", () => {
  it("accepts a valid country record", () => {
    expect(countrySchema.parse(validCountry)).toMatchObject(validCountry);
  });

  it("rejects invalid slugs and electrical values", () => {
    const result = countrySchema.safeParse({
      ...validCountry,
      slug: "Example Country",
      voltages: [12],
      frequencies: [55],
    });

    expect(result.success).toBe(false);
  });

  it("rejects duplicate country identities", () => {
    const result = countriesSchema.safeParse([
      validCountry,
      { ...validCountry, name: "Another Name" },
    ]);

    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.message.includes("Duplicate code"))).toBe(
      true,
    );
  });

  it("rejects unsupported plug letters", () => {
    const result = plugSchema.safeParse({
      type: "P",
      slug: "type-p",
      name: "Type P",
      description: "An intentionally invalid plug record used only for schema testing.",
      pinCounts: [3],
      pinShape: "round",
      grounding: "grounded",
      polarized: "yes",
      typicalCurrentAmps: [10],
      technicalStandard: "TEST",
      imageKey: "type-p",
    });

    expect(result.success).toBe(false);
  });

  it("rejects repeated electrical values within a record", () => {
    const result = countrySchema.safeParse({
      ...validCountry,
      plugTypes: ["G", "G"],
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toContainEqual(
      expect.objectContaining({ path: ["plugTypes"] }),
    );
  });

  it("requires two different countries for a comparison", () => {
    expect(
      comparisonFormSchema.safeParse({
        fromCountry: "japan",
        toCountry: "japan",
      }).success,
    ).toBe(false);

    expect(
      comparisonFormSchema.safeParse({
        fromCountry: "united-kingdom",
        toCountry: "japan",
      }).success,
    ).toBe(true);
  });
});
