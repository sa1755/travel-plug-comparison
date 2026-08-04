"use client";

import { Search, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GlobeMethods } from "react-globe.gl";
import { feature } from "topojson-client";
import atlas from "world-atlas/countries-110m.json";

import citiesJson from "@/data/cities.json";
import type { JourneyCountry } from "@/components/comparison/travel-plug-journey";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

interface CityPoint {
  readonly id: string;
  readonly name: string;
  readonly countryCode: string;
  readonly lat: number;
  readonly lng: number;
  readonly population: number;
  readonly isCapital: boolean;
}

interface CountryFeature extends GeoJSON.Feature {
  readonly id?: string | number;
  readonly properties: { readonly name?: string } | null;
}

interface GlobeExplorerProps {
  readonly countries: readonly JourneyCountry[];
  readonly onSelect: (slug: string) => void;
  readonly onClose: () => void;
}

export function GlobeExplorer({ countries, onSelect, onClose }: GlobeExplorerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [query, setQuery] = useState("");
  const [hovered, setHovered] = useState("");
  const [size, setSize] = useState({ width: 760, height: 680 });

  const countryByNumeric = useMemo(
    () => new Map(countries.map((country) => [Number(country.numericCode), country])),
    [countries],
  );
  const countryByCode = useMemo(() => new Map(countries.map((country) => [country.code, country])), [countries]);
  const polygons = useMemo(() => {
    const collection = feature(atlas as never, (atlas as unknown as { objects: { countries: never } }).objects.countries);
    return (collection as unknown as { features: CountryFeature[] }).features.filter(({ id }) => countryByNumeric.has(Number(id)));
  }, [countryByNumeric]);
  const cities = citiesJson as CityPoint[];

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return countries.slice(0, 12);
    return countries.filter(({ name }) => name.toLocaleLowerCase().includes(normalized)).slice(0, 30);
  }, [countries, query]);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    const updateSize = () => setSize({
      width: Math.max(320, window.innerWidth - Math.min(360, window.innerWidth * 0.34)),
      height: window.innerHeight,
    });
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const controls = globeRef.current?.controls();
      if (!controls) return;
      controls.autoRotate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      controls.autoRotateSpeed = 0.35;
    }, 500);
    return () => window.clearTimeout(timer);
  }, []);

  const stopRotation = () => {
    const controls = globeRef.current?.controls();
    if (controls) controls.autoRotate = false;
  };

  return (
    <dialog ref={dialogRef} className="globe-dialog" onClose={onClose} onCancel={onClose}>
      <div className="globe-layout">
        <aside className="globe-sidebar">
          <div className="globe-sidebar__header">
            <div><p className="section-label">Explore</p><h2>Choose a destination</h2></div>
            <button type="button" aria-label="Close globe" onClick={() => dialogRef.current?.close()}><X /></button>
          </div>
          <label className="globe-search">
            <Search aria-hidden="true" />
            <span className="sr-only">Search countries</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search 242 locations" autoFocus />
          </label>
          <p className="globe-hint">Spin, hover, or use this accessible list. City dots cover capitals and cities over 100,000 people.</p>
          <div className="globe-country-list" role="list">
            {results.map((country) => (
              <button type="button" key={country.slug} onClick={() => onSelect(country.slug)}>
                <span aria-hidden="true">{country.flag}</span><span>{country.name}</span>
              </button>
            ))}
          </div>
          <p className="globe-attribution">City data © GeoNames, CC BY 4.0. Globe geography: Natural Earth via world-atlas.</p>
        </aside>
        <div className="globe-canvas" onPointerDown={stopRotation}>
          <p className="globe-hover-label" aria-live="polite">{hovered || "Drag to explore the world"}</p>
          <Globe
            ref={globeRef}
            width={size.width}
            height={size.height}
            backgroundColor="#f4efe6"
            showAtmosphere
            atmosphereColor="#2563eb"
            atmosphereAltitude={0.12}
            polygonsData={polygons}
            polygonAltitude={0.008}
            polygonCapColor={(item) => Number((item as CountryFeature).id) % 3 === 0 ? "#c96f4a" : "#71764a"}
            polygonSideColor={() => "rgba(59,42,34,.18)"}
            polygonStrokeColor={() => "#f4efe6"}
            polygonLabel={(item) => countryByNumeric.get(Number((item as CountryFeature).id))?.name ?? ""}
            onPolygonHover={(item) => setHovered(item ? countryByNumeric.get(Number((item as CountryFeature).id))?.name ?? "" : "")}
            onPolygonClick={(item) => {
              const country = countryByNumeric.get(Number((item as CountryFeature).id));
              if (country) onSelect(country.slug);
            }}
            pointsData={cities}
            pointLat="lat"
            pointLng="lng"
            pointAltitude={0.015}
            pointRadius={(item) => (item as CityPoint).isCapital ? 0.16 : 0.08}
            pointColor={() => "#2563eb"}
            pointLabel={(item) => {
              const city = item as CityPoint;
              return `${city.name}, ${countryByCode.get(city.countryCode)?.name ?? city.countryCode}`;
            }}
            onPointHover={(item) => {
              const city = item as CityPoint | null;
              setHovered(city ? `${city.name}, ${countryByCode.get(city.countryCode)?.name ?? city.countryCode}` : "");
            }}
            onPointClick={(item) => {
              const country = countryByCode.get((item as CityPoint).countryCode);
              if (country) onSelect(country.slug);
            }}
          />
        </div>
      </div>
    </dialog>
  );
}
