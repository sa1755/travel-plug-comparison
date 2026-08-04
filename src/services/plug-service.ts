import plugsJson from "@/data/plugs.json";
import { plugsSchema } from "@/lib/schemas";
import { getCountries, type CountryRecord } from "@/services/country-service";
import type { Plug, PlugType } from "@/types";
import { deepFreeze, type DeepReadonly } from "@/utils/deep-freeze";
import { normalizeSearchTerm } from "@/utils/normalize-search-term";

export type PlugRecord = DeepReadonly<Plug>;

const plugs = deepFreeze(plugsSchema.parse(plugsJson));

export function getPlugs(): readonly PlugRecord[] {
  return plugs;
}

export function getPlugByType(type: string): PlugRecord | undefined {
  const normalizedType = type.trim().toLocaleUpperCase("en");
  return plugs.find((plug) => plug.type === normalizedType);
}

export function getPlugBySlug(slug: string): PlugRecord | undefined {
  const normalizedSlug = normalizeSearchTerm(slug);
  return plugs.find((plug) => plug.slug === normalizedSlug);
}

export function requirePlug(identifier: string): PlugRecord {
  const plug = getPlugByType(identifier) ?? getPlugBySlug(identifier);
  if (!plug) {
    throw new Error(`Unknown plug type: ${identifier}`);
  }
  return plug;
}

export function getCountriesUsingPlug(type: PlugType): readonly CountryRecord[] {
  return getCountries().filter((country) => country.plugTypes.includes(type));
}

export function getPlugStaticParams(): readonly { type: string }[] {
  return plugs.map((plug) => ({ type: plug.slug }));
}
