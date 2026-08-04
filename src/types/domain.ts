import type { z } from "zod";

import type {
  countrySchema,
  comparisonFormSchema,
  deviceCheckerFormSchema,
  deviceProfileSchema,
  plugSchema,
} from "@/lib/schemas";
import type {
  COMPARISON_ASPECTS,
  COMPATIBILITY_LEVELS,
  DEVICE_VOLTAGE_PROFILES,
  PLUG_TYPES,
} from "@/types/constants";

export type PlugType = (typeof PLUG_TYPES)[number];
export type DeviceVoltageProfile = (typeof DEVICE_VOLTAGE_PROFILES)[number];
export type CompatibilityLevel = (typeof COMPATIBILITY_LEVELS)[number];
export type ComparisonAspect = (typeof COMPARISON_ASPECTS)[number];

export type Country = z.infer<typeof countrySchema>;
export type ComparisonFormValues = z.infer<typeof comparisonFormSchema>;
export type DeviceCheckerFormValues = z.infer<typeof deviceCheckerFormSchema>;
export type Plug = z.infer<typeof plugSchema>;
export type DeviceProfile = z.infer<typeof deviceProfileSchema>;

export interface BaseComparisonFinding {
  readonly level: CompatibilityLevel;
  readonly title: string;
  readonly summary: string;
}

export type AdapterStatus = "not-required" | "check-specific-plug" | "required";
export type VoltageStatus =
  | "same"
  | "check-device"
  | "variable-destination"
  | "converter-may-be-required";
export type FrequencyStatus = "same" | "variable-destination" | "check-device";

export interface PlugComparison extends BaseComparisonFinding {
  readonly aspect: "plug";
  readonly status: AdapterStatus;
  readonly originPlugTypes: readonly PlugType[];
  readonly destinationPlugTypes: readonly PlugType[];
  readonly compatibleOriginPlugTypes: readonly PlugType[];
}

export interface VoltageComparison extends BaseComparisonFinding {
  readonly aspect: "voltage";
  readonly status: VoltageStatus;
  readonly originVoltages: readonly number[];
  readonly destinationVoltages: readonly number[];
  readonly sharedVoltages: readonly number[];
}

export interface FrequencyComparison extends BaseComparisonFinding {
  readonly aspect: "frequency";
  readonly status: FrequencyStatus;
  readonly originFrequencies: readonly number[];
  readonly destinationFrequencies: readonly number[];
  readonly sharedFrequencies: readonly number[];
}

export interface DeviceComparison extends BaseComparisonFinding {
  readonly aspect: "device";
  readonly deviceId: string;
  readonly deviceName: string;
  readonly guidance: string;
}

export type ComparisonFinding =
  | PlugComparison
  | VoltageComparison
  | FrequencyComparison
  | DeviceComparison;

export interface ComparisonResult {
  readonly fromCountryCode: string;
  readonly toCountryCode: string;
  readonly level: CompatibilityLevel;
  readonly summary: string;
  readonly plug: PlugComparison;
  readonly voltage: VoltageComparison;
  readonly frequency: FrequencyComparison;
  readonly devices: readonly DeviceComparison[];
}
