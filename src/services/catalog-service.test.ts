import { describe, expect, it } from "vitest";

import { assertCatalogIntegrity, getCatalogIntegrityIssues } from "@/services/catalog-service";
import {
  getCountries,
  getCountryByCode,
  getCountryByIdentifier,
  getCountryBySlug,
  getCountryStaticParams,
  requireCountry,
  searchCountries,
} from "@/services/country-service";
import {
  getCountriesUsingPlug,
  getPlugBySlug,
  getPlugByType,
  getPlugs,
  getPlugStaticParams,
  requirePlug,
} from "@/services/plug-service";
import { getDeviceProfile, getDeviceProfiles, requireDeviceProfile } from "@/services/device-service";
import { PLUG_TYPES } from "@/types";

describe("catalog integrity", () => {
  it("contains every required record and valid cross-reference", () => {
    expect(getCatalogIntegrityIssues()).toEqual([]);
    expect(() => assertCatalogIntegrity()).not.toThrow();
    expect(getCountries()).toHaveLength(17);
    expect(getPlugs().map((plug) => plug.type)).toEqual(PLUG_TYPES);
    expect(getDeviceProfiles()).toHaveLength(8);
  });

  it("preserves countries with multiple electrical values", () => {
    expect(requireCountry("Brazil").voltages).toEqual([127, 220]);
    expect(requireCountry("Japan").frequencies).toEqual([50, 60]);
  });

  it("exposes deeply frozen catalog values", () => {
    const japan = requireCountry("JP");
    const typeA = requirePlug("A");

    expect(Object.isFrozen(getCountries())).toBe(true);
    expect(Object.isFrozen(japan)).toBe(true);
    expect(Object.isFrozen(japan.plugTypes)).toBe(true);
    expect(Object.isFrozen(typeA.typicalCurrentAmps)).toBe(true);
  });
});

describe("country service", () => {
  it("looks up countries by slug, code, name, and alias", () => {
    expect(getCountryBySlug("japan")?.code).toBe("JP");
    expect(getCountryByCode("gb")?.name).toBe("United Kingdom");
    expect(getCountryByIdentifier("United Arab Emirates")?.code).toBe("AE");
    expect(getCountryByIdentifier("UAE")?.code).toBe("AE");
    expect(getCountryByIdentifier("unknown")).toBeUndefined();
  });

  it("searches names and aliases without accents", () => {
    expect(searchCountries("espana").map((country) => country.code)).toEqual(["ES"]);
    expect(searchCountries("united").map((country) => country.code)).toEqual([
      "GB",
      "US",
      "AE",
    ]);
    expect(searchCountries("   ")).toEqual([]);
  });

  it("throws for required records that do not exist", () => {
    expect(() => requireCountry("not-a-country")).toThrow("Unknown country");
  });

  it("generates stable country route params", () => {
    const params = getCountryStaticParams();
    expect(params).toHaveLength(17);
    expect(params).toContainEqual({ country: "south-africa" });
  });
});

describe("plug service", () => {
  it("looks up plug types and slugs", () => {
    expect(getPlugByType("g")?.slug).toBe("type-g");
    expect(getPlugBySlug("type-o")?.type).toBe("O");
    expect(() => requirePlug("P")).toThrow("Unknown plug type");
  });

  it("derives plug-to-country relationships", () => {
    expect(getCountriesUsingPlug("G").map((country) => country.code)).toEqual([
      "GB",
      "SG",
      "AE",
    ]);
    expect(getCountriesUsingPlug("O").map((country) => country.code)).toEqual(["TH"]);
  });

  it("generates stable plug route params", () => {
    const params = getPlugStaticParams();
    expect(params).toHaveLength(15);
    expect(params.at(0)).toEqual({ type: "type-a" });
    expect(params.at(-1)).toEqual({ type: "type-o" });
  });
});

describe("device service", () => {
  it("returns the requested device guidance", () => {
    expect(getDeviceProfile("phone-charger")?.voltageProfile).toBe(
      "typically-dual-voltage",
    );
    expect(requireDeviceProfile("cpap-machine").voltageProfile).toBe(
      "check-manufacturer-guidance",
    );
    expect(() => requireDeviceProfile("kettle")).toThrow("Unknown device profile");
  });
});
