import { getCountries } from "@/services/country-service";
import { getDeviceProfiles } from "@/services/device-service";
import { getPlugs } from "@/services/plug-service";
import { PLUG_TYPES } from "@/types";

const REQUIRED_COUNTRY_CODES = [
  "GB",
  "US",
  "CA",
  "AU",
  "NZ",
  "JP",
  "CN",
  "IN",
  "TH",
  "SG",
  "FR",
  "DE",
  "ES",
  "IT",
  "BR",
  "AE",
  "ZA",
] as const;

const REQUIRED_DEVICE_IDS = [
  "phone-charger",
  "laptop",
  "smartwatch",
  "camera-charger",
  "hair-dryer",
  "hair-straightener",
  "electric-toothbrush",
  "gaming-console",
  "cpap-machine",
] as const;

export function getCatalogIntegrityIssues(): readonly string[] {
  const countries = getCountries();
  const plugs = getPlugs();
  const devices = getDeviceProfiles();
  const issues: string[] = [];
  const countryCodes = new Set(countries.map((country) => country.code));
  const plugTypes = new Set(plugs.map((plug) => plug.type));
  const deviceIds = new Set(devices.map((device) => device.id));

  REQUIRED_COUNTRY_CODES.forEach((code) => {
    if (!countryCodes.has(code)) {
      issues.push(`Missing required country: ${code}`);
    }
  });

  PLUG_TYPES.forEach((type) => {
    if (!plugTypes.has(type)) {
      issues.push(`Missing plug record: ${type}`);
    }
  });

  countries.forEach((country) => {
    country.plugTypes.forEach((type) => {
      if (!plugTypes.has(type)) {
        issues.push(`${country.code} references unknown plug type ${type}`);
      }
    });
  });

  REQUIRED_DEVICE_IDS.forEach((id) => {
    if (!deviceIds.has(id)) {
      issues.push(`Missing required device profile: ${id}`);
    }
  });

  return issues;
}

export function assertCatalogIntegrity(): void {
  const issues = getCatalogIntegrityIssues();
  if (issues.length > 0) {
    throw new Error(`Invalid TravelPlug catalog:\n- ${issues.join("\n- ")}`);
  }
}
