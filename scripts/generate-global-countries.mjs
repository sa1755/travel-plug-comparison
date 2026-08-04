import fs from "node:fs";
import { JSDOM } from "jsdom";
import worldCountries from "world-countries";

const sourceUrl = "https://www.worldstandards.eu/electricity/plug-voltage-by-country/";
const sourceFile = process.argv[2];
const html = sourceFile
  ? fs.readFileSync(sourceFile, "utf8")
  : await fetch(sourceUrl).then((response) => {
      if (!response.ok) throw new Error(`Country source returned ${response.status}`);
      return response.text();
    });

const existing = JSON.parse(fs.readFileSync(new URL("../src/data/countries.json", import.meta.url)));
const existingByCode = new Map(existing.map((country) => [country.code, country]));
const document = new JSDOM(html).window.document;

const cleanName = (value) => value.replace(/\([^)]*\)/g, "").trim();
const normalize = (value) =>
  cleanName(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
const slugify = (value) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const rows = [...document.querySelectorAll("#tablepress-1 tbody tr")].map((row) => {
  const cells = [...row.cells].map((cell) => cell.textContent.trim().replace(/\s+/g, " "));
  return {
    name: cleanName(cells[0]),
    rawName: cells[0],
    plugTypes: [...new Set(cells[1].match(/\b[A-O]\b/g) ?? [])],
    voltages: [...new Set((cells[2].match(/\d+/g) ?? []).map(Number))],
    frequencies: [...new Set((cells[3].match(/\d+/g) ?? []).map(Number))],
  };
});
const rowMap = new Map(rows.map((row) => [normalize(row.name), row]));

const aliases = {
  boliviaplurinationalstateof: "bolivia",
  bruneidarussalam: "brunei",
  caboverde: "capeverde",
  caribbeannetherlands: "bonaire",
  congodemocraticrepublicofthe: "democraticrepublicofthecongo",
  congorepublicofthe: "republicofthecongo",
  cotedivoire: "ivorycoast",
  czechia: "czechrepublic",
  eswatini: "swaziland",
  koreademocraticpeoplesrepublicof: "northkorea",
  korearepublicof: "southkorea",
  laopeoplesdemocraticrepublic: "laos",
  micronesiafederatedstatesof: "micronesiafederalstatesof",
  moldovarepublicof: "moldova",
  palestinestateof: "palestinianterritories",
  russianfederation: "russia",
  syrianarabrepublic: "syria",
  taiwanprovinceofchina: "taiwan",
  tanzaniaunitedrepublicof: "tanzania",
  trinidadandtobago: "trinidadtobago",
  turkiye: "turkey",
  unitedstatesofamerica: "unitedstates",
  venezuelabolivarianrepublicof: "venezuela",
  vietnam: "vietnam",
  virginislandsbritish: "britishvirginislands",
  virginislandsus: "usvirginislands",
};

const inheritedStandards = {
  AX: "FI",
  IO: "GB",
  MP: "GU",
  SJ: "NO",
};
const excludedCodes = new Set(["AQ", "TF", "BV", "HM", "GS", "UM"]);

const findRow = (country) => {
  const names = [country.name.common, country.name.official, ...country.altSpellings].map(normalize);
  for (const name of names) {
    const direct = rowMap.get(name);
    if (direct) return direct;
    const aliased = rowMap.get(aliases[name]);
    if (aliased) return aliased;
  }
};

const resolvedRows = new Map();
for (const country of worldCountries) {
  const row = findRow(country);
  if (row) resolvedRows.set(country.cca2, row);
}
for (const [code, inheritedCode] of Object.entries(inheritedStandards)) {
  const inherited = resolvedRows.get(inheritedCode);
  if (inherited) resolvedRows.set(code, inherited);
}

const records = worldCountries
  .filter((country) => !excludedCodes.has(country.cca2) && resolvedRows.has(country.cca2))
  .map((country) => {
    const row = resolvedRows.get(country.cca2);
    if (!row.plugTypes.length || !row.voltages.length || !row.frequencies.length) {
      throw new Error(`Incomplete electricity data for ${country.name.common}`);
    }
    const previous = existingByCode.get(country.cca2);
    const typeLabel = row.plugTypes.map((type) => `Type ${type}`).join(", ");
    const voltageLabel = row.voltages.join(" or ");
    const frequencyLabel = row.frequencies.join(" or ");
    const aliasesForSearch = [...new Set([
      ...country.altSpellings,
      country.name.official,
      ...(previous?.aliases ?? []),
    ])].filter((alias) => alias && alias !== country.name.common);

    return {
      name: country.name.common,
      slug: previous?.slug ?? slugify(country.name.common),
      code: country.cca2,
      numericCode: country.ccn3 || (country.cca2 === "XK" ? "983" : ""),
      flag: country.flag || [...country.cca2].map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0))).join(""),
      aliases: aliasesForSearch,
      region: country.region,
      capital: country.capital[0] ?? country.name.common,
      coordinates: country.latlng,
      voltages: row.voltages,
      frequencies: row.frequencies,
      plugTypes: row.plugTypes,
      ...(previous?.powerNote
        ? { powerNote: previous.powerNote }
        : row.voltages.length > 1 || row.frequencies.length > 1
          ? { powerNote: "The local supply can vary by region. Confirm it at your accommodation before connecting a device." }
          : {}),
      travelAdvice:
        previous?.travelAdvice ??
        `${typeLabel} sockets are commonly listed. Check that each device supports ${voltageLabel} V and ${frequencyLabel} Hz before use.`,
    };
  })
  .sort((left, right) => left.name.localeCompare(right.name, "en"));

const requiredCodes = ["GB", "US", "CA", "AU", "JP", "BR", "IN", "ZA", "VA", "SS", "MH"];
for (const code of requiredCodes) {
  if (!records.some((record) => record.code === code)) throw new Error(`Missing required location ${code}`);
}
if (new Set(records.map((record) => record.slug)).size !== records.length) {
  throw new Error("Generated duplicate country slugs");
}

fs.writeFileSync(
  new URL("../src/data/countries.json", import.meta.url),
  `${JSON.stringify(records, null, 2)}\n`,
);
console.log(`Generated ${records.length} validated travel locations from ${sourceUrl}`);
