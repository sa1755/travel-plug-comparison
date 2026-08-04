import countriesJson from "@/data/countries.json";
import { countriesSchema } from "@/lib/schemas";
import type { Country } from "@/types";
import { deepFreeze, type DeepReadonly } from "@/utils/deep-freeze";
import { normalizeSearchTerm } from "@/utils/normalize-search-term";

export type CountryRecord = DeepReadonly<Country>;

const countries = deepFreeze(countriesSchema.parse(countriesJson));

const matchesCountry = (country: CountryRecord, normalizedQuery: string) => {
  const searchableValues = [country.name, country.slug, country.code, ...country.aliases];
  return searchableValues.some((value) => normalizeSearchTerm(value) === normalizedQuery);
};

export function getCountries(): readonly CountryRecord[] {
  return countries;
}

export function getCountryBySlug(slug: string): CountryRecord | undefined {
  const normalizedSlug = normalizeSearchTerm(slug);
  return countries.find((country) => country.slug === normalizedSlug);
}

export function getCountryByCode(code: string): CountryRecord | undefined {
  const normalizedCode = code.trim().toLocaleUpperCase("en");
  return countries.find((country) => country.code === normalizedCode);
}

export function getCountryByIdentifier(identifier: string): CountryRecord | undefined {
  const normalizedIdentifier = normalizeSearchTerm(identifier);
  if (!normalizedIdentifier) {
    return undefined;
  }

  return countries.find((country) => matchesCountry(country, normalizedIdentifier));
}

export function requireCountry(identifier: string): CountryRecord {
  const country = getCountryByIdentifier(identifier);
  if (!country) {
    throw new Error(`Unknown country: ${identifier}`);
  }
  return country;
}

export function searchCountries(query: string): readonly CountryRecord[] {
  const normalizedQuery = normalizeSearchTerm(query);
  if (!normalizedQuery) {
    return [];
  }

  return countries.filter((country) =>
    [country.name, country.slug, country.code, ...country.aliases].some((value) =>
      normalizeSearchTerm(value).includes(normalizedQuery),
    ),
  );
}

export function getCountryStaticParams(): readonly { country: string }[] {
  return countries.map((country) => ({ country: country.slug }));
}

export function getComparisonStaticParams(): readonly { from: string; to: string }[] {
  return countries.flatMap((origin) =>
    countries
      .filter((destination) => destination.code !== origin.code)
      .map((destination) => ({ from: origin.slug, to: destination.slug })),
  );
}
