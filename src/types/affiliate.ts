import type { PlugType } from "@/types/domain";

export interface AdapterProduct {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly retailer: string;
  readonly productUrl: string;
  readonly affiliateUrl?: string;
  readonly affiliateProgramme?: "amazon-associates" | "other";
  readonly affiliateDisclosure?: string;
  readonly imageUrl?: string;
  readonly originPlugTypes: readonly PlugType[];
  readonly destinationPlugTypes: readonly PlugType[];
  readonly supportedOriginCountries?: readonly string[];
  readonly supportedDestinationCountries?: readonly string[];
  readonly active: boolean;
  readonly priority: number;
}
