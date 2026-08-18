import { adapterProducts } from "@/data/adapter-products";
import type { AdapterProduct, PlugType } from "@/types";

interface AdapterRecommendationQuery {
  readonly originCountry: string;
  readonly destinationCountry: string;
  readonly originPlugTypes: readonly PlugType[];
  readonly destinationPlugTypes: readonly PlugType[];
}

const overlaps = <Value,>(left: readonly Value[], right: readonly Value[]) =>
  left.some((value) => right.includes(value));

export function findAdapterRecommendations(
  query: AdapterRecommendationQuery,
  products: readonly AdapterProduct[] = adapterProducts,
): readonly AdapterProduct[] {
  return products
    .filter((product) => {
      if (!product.active) return false;
      if (!overlaps(product.originPlugTypes, query.originPlugTypes)) return false;
      if (!overlaps(product.destinationPlugTypes, query.destinationPlugTypes)) return false;
      if (product.supportedCountries?.length) {
        return product.supportedCountries.includes(query.destinationCountry);
      }
      return true;
    })
    .toSorted((left, right) => right.priority - left.priority);
}
