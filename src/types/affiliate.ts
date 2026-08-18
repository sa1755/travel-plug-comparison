import type { PlugType } from "@/types/domain";

export interface AdapterProduct {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly retailer: string;
  readonly productUrl: string;
  readonly affiliateUrl?: string;
  readonly imageUrl?: string;
  readonly price?: number;
  readonly currency?: string;
  readonly originPlugTypes: readonly PlugType[];
  readonly destinationPlugTypes: readonly PlugType[];
  readonly supportedCountries?: readonly string[];
  readonly active: boolean;
  readonly priority: number;
}
