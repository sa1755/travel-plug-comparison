import { readFile, writeFile } from "node:fs/promises";

import countries from "../src/data/countries.json" with { type: "json" };

const inputPath = process.argv[2];
if (!inputPath) throw new Error("Pass the extracted GeoNames cities5000.txt path.");

const supportedCodes = new Set(countries.map(({ code }) => code));
const rows = (await readFile(inputPath, "utf8")).trim().split("\n");
const cities = rows.flatMap((row) => {
  const fields = row.split("\t");
  const population = Number(fields[14]);
  const isCapital = fields[7] === "PPLC";
  if (!supportedCodes.has(fields[8]) || (!isCapital && population < 100_000)) return [];

  return [{
    id: fields[0],
    name: fields[1],
    countryCode: fields[8],
    lat: Number(fields[4]),
    lng: Number(fields[5]),
    population,
    isCapital,
  }];
});

cities.sort((left, right) => right.population - left.population);
await writeFile("src/data/cities.json", `${JSON.stringify(cities, null, 2)}\n`);
console.log(`Generated ${cities.length} cities (capitals or population 100,000+).`);
