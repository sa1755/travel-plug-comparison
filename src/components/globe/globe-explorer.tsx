"use client";

import { Search, X } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GlobeMethods } from "react-globe.gl";
import { MeshPhongMaterial } from "three";
import { feature } from "topojson-client";
import atlas from "world-atlas/countries-110m.json";

import citiesJson from "@/data/cities.json";
import type { JourneyCountry } from "@/components/comparison/travel-plug-journey";
import { Logo } from "@/components/ui/logo";

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
  readonly excludedSlug?: string;
  readonly onSelect: (slug: string) => void;
  readonly onClose: () => void;
}

const LAND_GREENS = ["#2f6b45", "#3f7d4e", "#528b57", "#669b62", "#78a86c"] as const;

export function GlobeExplorer({ countries, excludedSlug, onSelect, onClose }: GlobeExplorerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [query, setQuery] = useState("");
  const [hovered, setHovered] = useState("");
  const [size, setSize] = useState({ width: 760, height: 680 });
  const oceanMaterial = useMemo(() => new MeshPhongMaterial({
    color: "#2f79b9",
    shininess: 18,
    specular: "#9ed8f5",
  }), []);

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
    const availableCountries = countries.filter(({ slug }) => slug !== excludedSlug);
    if (!normalized) return availableCountries.slice(0, 12);
    return availableCountries.filter(({ name, code, aliases }) =>
      [name, code, ...aliases].some((value) => value.toLocaleLowerCase().includes(normalized)),
    ).slice(0, 30);
  }, [countries, excludedSlug, query]);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    window.requestAnimationFrame(() => headingRef.current?.focus());
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: Math.max(1, Math.round(entry.contentRect.width)),
        height: Math.max(1, Math.round(entry.contentRect.height)),
      });
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => oceanMaterial.dispose(), [oceanMaterial]);

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

  const selectCountry = (country: JourneyCountry) => {
    if (country.slug === excludedSlug) {
      setHovered(`${country.name} is already your home country. Choose another destination.`);
      return;
    }
    onSelect(country.slug);
  };

  const closeForNavigation = () => dialogRef.current?.close();

  return (
    <dialog ref={dialogRef} className="globe-dialog" aria-labelledby="globe-dialog-title" onClose={onClose} onCancel={onClose}>
      <header className="globe-topbar">
        <Link href="/" aria-label="TravelPlug home" onClick={closeForNavigation}><Logo /></Link>
        <nav aria-label="Globe view navigation">
          <Link href="/#compare" onClick={closeForNavigation}>Compare</Link>
          <Link href="/#safety" onClick={closeForNavigation}>Power safety</Link>
          <button type="button" aria-label="Close globe view" onClick={() => dialogRef.current?.close()}><X aria-hidden="true" /></button>
        </nav>
      </header>
      <div className="globe-layout">
        <aside className="globe-sidebar">
          <div className="globe-sidebar__header">
            <div><p className="section-label">Globe view</p><h2 ref={headingRef} tabIndex={-1} id="globe-dialog-title">Choose a destination</h2></div>
            <button type="button" aria-label="Close globe" onClick={() => dialogRef.current?.close()}><X /></button>
          </div>
          <label className="globe-search">
            <Search aria-hidden="true" />
            <span className="sr-only">Search countries</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search 242 locations" />
          </label>
          <p className="globe-hint">Spin, hover, or use this accessible list. City dots cover capitals and cities over 100,000 people.</p>
          <div className="globe-country-list" role="list">
            {results.map((country) => (
              <button type="button" key={country.slug} onClick={() => selectCountry(country)}>
                <span aria-hidden="true">{country.flag}</span><span>{country.name}</span>
              </button>
            ))}
            {!results.length ? <p className="globe-hint">No matching location. Try a country name or two-letter code.</p> : null}
          </div>
          <p className="globe-attribution">City data © GeoNames, CC BY 4.0. Globe geography: Natural Earth via world-atlas.</p>
        </aside>
        <div ref={canvasRef} className="globe-canvas" onPointerDown={stopRotation}>
          <p className="globe-hover-label">{hovered || "Drag to explore the world"}</p>
          <Globe
            ref={globeRef}
            width={size.width}
            height={size.height}
            backgroundColor="#dcecf2"
            globeMaterial={oceanMaterial}
            showAtmosphere
            atmosphereColor="#78c3e3"
            atmosphereAltitude={0.12}
            polygonsData={polygons}
            polygonAltitude={0.008}
            polygonCapColor={(item) => LAND_GREENS[Math.abs(Number((item as CountryFeature).id)) % LAND_GREENS.length]}
            polygonSideColor={() => "rgba(20,66,39,.42)"}
            polygonStrokeColor={() => "#c9e3bc"}
            polygonLabel={(item) => countryByNumeric.get(Number((item as CountryFeature).id))?.name ?? ""}
            onPolygonHover={(item) => {
              const country = item ? countryByNumeric.get(Number((item as CountryFeature).id)) : undefined;
              setHovered(country ? `${country.name} · Type ${country.plugTypes.join("/")} · ${country.voltages.join("/")} V` : "");
            }}
            onPolygonClick={(item) => {
              const country = countryByNumeric.get(Number((item as CountryFeature).id));
              if (country) selectCountry(country);
            }}
            pointsData={cities}
            pointLat="lat"
            pointLng="lng"
            pointAltitude={0.015}
            pointRadius={(item) => (item as CityPoint).isCapital ? 0.16 : 0.08}
            pointColor={() => "#f4b45f"}
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
              if (country) selectCountry(country);
            }}
          />
        </div>
      </div>
    </dialog>
  );
}
