import { TravelPlugJourney } from "@/components/comparison/travel-plug-journey";
import { getCountries } from "@/services/country-service";
import { getFeaturedDeviceProfiles } from "@/services/device-service";

export default function HomePage() {
  const countries = getCountries().map((country) => ({
    name: country.name,
    slug: country.slug,
    code: country.code,
    numericCode: country.numericCode,
    flag: country.flag,
    plugTypes: country.plugTypes,
    voltages: country.voltages,
    frequencies: country.frequencies,
    coordinates: country.coordinates,
    aliases: country.aliases,
  }));

  return <TravelPlugJourney countries={countries} devices={getFeaturedDeviceProfiles()} />;
}
