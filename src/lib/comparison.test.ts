import { describe, expect, it } from "vitest";

import {
  compareCountries,
  compareDevice,
  compareFrequency,
  comparePlugCompatibility,
  compareVoltage,
} from "@/lib/comparison";
import { requireCountry } from "@/services/country-service";
import { requireDeviceProfile } from "@/services/device-service";

describe("plug compatibility", () => {
  it("recognizes fully compatible plug systems", () => {
    expect(comparePlugCompatibility(["A", "B"], ["A", "B"]).status).toBe(
      "not-required",
    );
    expect(comparePlugCompatibility(["C", "E"], ["C", "F"]).status).toBe(
      "not-required",
    );
  });

  it("recognizes partial compatibility", () => {
    const result = comparePlugCompatibility(["A", "I"], ["A", "B", "C", "O"]);
    expect(result.status).toBe("check-specific-plug");
    expect(result.compatibleOriginPlugTypes).toEqual(["A"]);
  });

  it("requires an adapter when no home plug type fits", () => {
    expect(comparePlugCompatibility(["G"], ["A", "B"]).status).toBe("required");
  });
});

describe("voltage compatibility", () => {
  it("recognizes an exact nominal match", () => {
    expect(compareVoltage([230], [230]).status).toBe("same");
  });

  it("requires a location check for variable destination voltage", () => {
    expect(compareVoltage([120], [127, 220]).status).toBe("variable-destination");
  });

  it("distinguishes nearby nominal values from different voltage systems", () => {
    expect(compareVoltage([100], [120]).status).toBe("check-device");
    expect(compareVoltage([230], [100]).status).toBe("converter-may-be-required");
  });
});

describe("frequency compatibility", () => {
  it("recognizes matching, variable, and different frequency supplies", () => {
    expect(compareFrequency([50], [50]).status).toBe("same");
    expect(compareFrequency([50], [50, 60]).status).toBe("variable-destination");
    expect(compareFrequency([50], [60]).status).toBe("check-device");
  });
});

describe("country comparisons", () => {
  it("returns a safe nominal result for the US to Canada", () => {
    const result = compareCountries(requireCountry("US"), requireCountry("CA"));
    expect(result.level).toBe("safe");
    expect(result.plug.status).toBe("not-required");
    expect(result.voltage.status).toBe("same");
    expect(result.frequency.status).toBe("same");
  });

  it("returns a cautious result for France to Germany without an adapter", () => {
    const result = compareCountries(requireCountry("FR"), requireCountry("DE"));
    expect(result.plug.status).toBe("not-required");
    expect(result.level).toBe("safe");
  });

  it("finds the major differences from the UK to Japan", () => {
    const devices = [requireDeviceProfile("phone-charger"), requireDeviceProfile("hair-dryer")];
    const result = compareCountries(requireCountry("GB"), requireCountry("JP"), devices);

    expect(result.level).toBe("danger");
    expect(result.plug.status).toBe("required");
    expect(result.voltage.status).toBe("converter-may-be-required");
    expect(result.frequency.status).toBe("variable-destination");
    expect(result.devices.map((device) => device.level)).toEqual(["warning", "danger"]);
  });

  it("flags Brazil's destination voltage as location-dependent", () => {
    const result = compareCountries(requireCountry("US"), requireCountry("BR"));
    expect(result.voltage.status).toBe("variable-destination");
    expect(result.level).toBe("warning");
  });
});

describe("device comparisons", () => {
  it("defers medical devices to manufacturer guidance", () => {
    const result = compareDevice(
      requireDeviceProfile("cpap-machine"),
      compareVoltage([230], [100]),
      compareFrequency([50], [60]),
    );

    expect(result.level).toBe("warning");
    expect(result.summary).toContain("manufacturer");
  });
});
