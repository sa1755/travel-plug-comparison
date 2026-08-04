import type { z } from "zod";

import type {
  countrySchema,
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
export type Plug = z.infer<typeof plugSchema>;
export type DeviceProfile = z.infer<typeof deviceProfileSchema>;

export interface ComparisonFinding {
  readonly aspect: ComparisonAspect;
  readonly level: CompatibilityLevel;
  readonly title: string;
  readonly summary: string;
}

export interface ComparisonResult {
  readonly fromCountryCode: string;
  readonly toCountryCode: string;
  readonly requiresAdapter: boolean;
  readonly summary: string;
  readonly findings: readonly ComparisonFinding[];
}
