import { adapterProducts } from "@/data/adapter-products";
import type { AdapterProduct, PlugType } from "@/types";

interface AdapterRecommendationQuery {
  readonly originCountry: string;
  readonly destinationCountry: string;
  readonly originPlugTypes: readonly PlugType[];
  readonly destinationPlugTypes: readonly PlugType[];
}

const isSecureUrl = (value: string) => {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};

export function findAdapterRecommendations(
  query: AdapterRecommendationQuery,
  products: readonly AdapterProduct[] = adapterProducts,
): readonly AdapterProduct[] {
  return products
    .filter((product) => {
      if (!product.active) return false;
      if (!isSecureUrl(product.productUrl)) return false;
      if (product.affiliateUrl && (
        !isSecureUrl(product.affiliateUrl) ||
        !product.affiliateProgramme ||
        !product.affiliateDisclosure?.trim()
      )) return false;
      if (!query.originPlugTypes.every((type) => product.originPlugTypes.includes(type))) return false;
      if (!query.destinationPlugTypes.every((type) => product.destinationPlugTypes.includes(type))) return false;
      if (product.supportedOriginCountries?.length &&
          !product.supportedOriginCountries.includes(query.originCountry)) return false;
      if (product.supportedDestinationCountries?.length &&
          !product.supportedDestinationCountries.includes(query.destinationCountry)) return false;
      return true;
    })
    .toSorted((left, right) => right.priority - left.priority);
}
