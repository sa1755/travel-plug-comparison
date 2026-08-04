import { normalizeSearchTerm } from "@/utils/normalize-search-term";

export interface CatalogSearchResult {
  readonly id: string;
  readonly kind: "country" | "plug";
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly marker: string;
}

export interface CatalogSearchEntry extends CatalogSearchResult {
  readonly searchValues: readonly string[];
}

export function filterCatalogSearch(
  entries: readonly CatalogSearchEntry[],
  query: string,
  limit = 8,
): readonly CatalogSearchResult[] {
  const normalizedQuery = normalizeSearchTerm(query);
  if (!normalizedQuery || limit <= 0) return [];

  return entries
    .map((candidate) => {
      const values = candidate.searchValues.map(normalizeSearchTerm);
      const exact = values.some((value) => value === normalizedQuery);
      const startsWith = values.some((value) => value.startsWith(normalizedQuery));
      const includes = values.some((value) => value.includes(normalizedQuery));
      return { candidate, rank: exact ? 0 : startsWith ? 1 : includes ? 2 : 3 };
    })
    .filter(({ rank }) => rank < 3)
    .sort((left, right) =>
      left.rank === right.rank
        ? left.candidate.title.localeCompare(right.candidate.title, "en")
        : left.rank - right.rank,
    )
    .slice(0, limit)
    .map(({ candidate }) => ({
      id: candidate.id,
      kind: candidate.kind,
      title: candidate.title,
      description: candidate.description,
      href: candidate.href,
      marker: candidate.marker,
    }));
}
