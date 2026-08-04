import { getCountries } from "@/services/country-service";
import { getPlugs } from "@/services/plug-service";
import {
  filterCatalogSearch,
  type CatalogSearchEntry,
  type CatalogSearchResult,
} from "@/lib/catalog-search";

const candidates: readonly CatalogSearchEntry[] = [
  ...getCountries().map((country) => ({
    id: `country-${country.code}`,
    kind: "country" as const,
    title: country.name,
    description: `Types ${country.plugTypes.join(", ")} · ${country.voltages.join("/")} V · ${country.frequencies.join("/")} Hz`,
    href: `/country/${country.slug}`,
    marker: country.flag,
    searchValues: [country.name, country.slug, country.code, ...country.aliases],
  })),
  ...getPlugs().map((plug) => ({
    id: `plug-${plug.type}`,
    kind: "plug" as const,
    title: plug.name,
    description: plug.description,
    href: `/plug/${plug.slug}`,
    marker: plug.type,
    searchValues: [plug.name, plug.type, plug.slug, plug.description, plug.technicalStandard],
  })),
];

export function searchCatalog(query: string, limit = 8): readonly CatalogSearchResult[] {
  return filterCatalogSearch(candidates, query, limit);
}

export function getCatalogSearchEntries(): readonly CatalogSearchEntry[] {
  return candidates;
}
