"use client";

import { Check, ChevronDown, Compass, LocateFixed, RotateCcw, ShieldAlert } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import { PlugIllustration } from "@/components/comparison/plug-illustration";
import { compareCountries } from "@/lib/comparison";
import type { PlugType } from "@/types";

const GlobeExplorer = dynamic(
  () => import("@/components/globe/globe-explorer").then((module) => module.GlobeExplorer),
  { ssr: false },
);

export interface JourneyCountry {
  readonly name: string;
  readonly slug: string;
  readonly code: string;
  readonly numericCode: string;
  readonly flag: string;
  readonly plugTypes: readonly PlugType[];
  readonly voltages: readonly number[];
  readonly frequencies: readonly number[];
  readonly coordinates: readonly [number, number];
}

interface TravelPlugJourneyProps {
  readonly countries: readonly JourneyCountry[];
  readonly initialFrom?: string;
  readonly initialTo?: string;
}

const HOME_KEY = "travelplug-home-country";

export function TravelPlugJourney({ countries, initialFrom, initialTo }: TravelPlugJourneyProps) {
  const [fromSlug, setFromSlug] = useState(initialFrom ?? "");
  const [toSlug, setToSlug] = useState(initialTo ?? "");
  const [locationStatus, setLocationStatus] = useState("");
  const [globeOpen, setGlobeOpen] = useState(false);

  useEffect(() => {
    if (!initialFrom) setFromSlug(localStorage.getItem(HOME_KEY) ?? "");
    if (new URLSearchParams(window.location.search).get("explore") === "globe") setGlobeOpen(true);
  }, [initialFrom]);

  const origin = countries.find(({ slug }) => slug === fromSlug);
  const destination = countries.find(({ slug }) => slug === toSlug);
  const result = useMemo(
    () => origin && destination ? compareCountries(origin, destination) : undefined,
    [origin, destination],
  );

  useEffect(() => {
    if (origin && destination && origin.code !== destination.code) {
      window.history.replaceState({}, "", `/compare/${origin.slug}/${destination.slug}`);
    }
  }, [origin, destination]);

  const rememberOrigin = (slug: string) => {
    setFromSlug(slug);
    if (slug) localStorage.setItem(HOME_KEY, slug);
  };

  const detectLocation = () => {
    setLocationStatus("Finding your country…");
    if (!("geolocation" in navigator)) {
      setLocationStatus("Location is unavailable. Choose your country below.");
      return;
    }
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const [{ geoContains }, atlas, { feature }] = await Promise.all([
          import("d3-geo"),
          import("world-atlas/countries-110m.json"),
          import("topojson-client"),
        ]);
        const collection = feature(
          atlas.default as never,
          (atlas.default as unknown as { objects: { countries: never } }).objects.countries,
        ) as unknown as { features: { id?: string | number; geometry: GeoJSON.Geometry }[] };
        const match = collection.features.find((country) =>
          geoContains(country as GeoJSON.Feature, [coords.longitude, coords.latitude]),
        );
        const found = countries.find(({ numericCode }) => Number(numericCode) === Number(match?.id));
        if (!found) throw new Error("No country match");
        rememberOrigin(found.slug);
        setLocationStatus(`${found.name} set as home. Your precise location stays in this browser.`);
      } catch {
        setLocationStatus("We could not match your position. Choose your country below.");
      }
    }, async () => {
      try {
        const response = await fetch("/api/location", { cache: "no-store" });
        const { countryCode } = await response.json() as { countryCode?: string };
        const found = countries.find(({ code }) => code === countryCode);
        if (!found) throw new Error("No approximate match");
        rememberOrigin(found.slug);
        setLocationStatus(`${found.name} set from your approximate region. You can change it below.`);
      } catch {
        setLocationStatus("Location permission was not granted. Choose your country below.");
      }
    }, { enableHighAccuracy: false, timeout: 10_000, maximumAge: 86_400_000 });
  };

  return (
    <section id="compare" className="journey-shell" aria-labelledby="journey-title">
      <div className="journey-intro">
        <p className="section-label">Plug confidence, worldwide</p>
        <h1 id="journey-title">Your plug. Their socket. One clear answer.</h1>
        <p>Choose where your devices come from and where you are going. We’ll show the plug shapes first.</p>
      </div>

      <div className="journey-grid">
        <CountryPanel
          eyebrow="You use"
          label="Where are you travelling from?"
          value={fromSlug}
          countries={countries}
          country={origin}
          onChange={rememberOrigin}
        >
          {!origin ? (
            <button type="button" className="location-button" onClick={detectLocation}>
              <LocateFixed aria-hidden="true" /> Use my location
            </button>
          ) : (
            <button
              type="button"
              className="text-button"
              onClick={() => { localStorage.removeItem(HOME_KEY); setFromSlug(""); }}
            >
              <RotateCcw aria-hidden="true" /> Change or forget home
            </button>
          )}
          {locationStatus ? <p className="location-status" role="status">{locationStatus}</p> : null}
        </CountryPanel>

        <CountryPanel
          eyebrow="They use"
          label="Where are you travelling to?"
          value={toSlug}
          countries={countries.filter(({ slug }) => slug !== fromSlug)}
          country={destination}
          onChange={setToSlug}
        >
          <button type="button" className="globe-button" onClick={() => setGlobeOpen(true)}>
            <Compass aria-hidden="true" /> Explore the globe
          </button>
        </CountryPanel>
      </div>

      {result && origin && destination ? (
        <div className={`trip-answer trip-answer--${result.level}`} aria-live="polite">
          <span className="answer-icon" aria-hidden="true">
            {result.plug.status === "not-required" ? <Check /> : <ShieldAlert />}
          </span>
          <div>
            <p className="answer-kicker">Bring</p>
            <h2>{result.plug.status === "not-required" ? "No plug adapter needed" : `A Type ${destination.plugTypes.join(" / ")} travel adapter`}</h2>
            <p>{result.plug.summary}</p>
            {result.voltage.status !== "same" || result.frequency.status !== "same" ? (
              <details>
                <summary>Check power compatibility</summary>
                <p><strong>Voltage:</strong> {result.voltage.summary}</p>
                <p><strong>Frequency:</strong> {result.frequency.summary}</p>
              </details>
            ) : null}
          </div>
        </div>
      ) : null}

      <div id="safety" className="device-note">
        <p><strong>Taking a device?</strong> Chargers and electronics are often multi-voltage. High-power or medical equipment needs its exact rating checked.</p>
      </div>

      {globeOpen ? (
        <GlobeExplorer
          countries={countries}
          onClose={() => setGlobeOpen(false)}
          onSelect={(slug) => { setToSlug(slug); setGlobeOpen(false); }}
        />
      ) : null}
    </section>
  );
}

function CountryPanel({ eyebrow, label, value, countries, country, onChange, children }: {
  readonly eyebrow: string;
  readonly label: string;
  readonly value: string;
  readonly countries: readonly JourneyCountry[];
  readonly country?: JourneyCountry;
  readonly onChange: (value: string) => void;
  readonly children: React.ReactNode;
}) {
  return (
    <article className="country-panel">
      <p className="country-panel__eyebrow">{eyebrow}</p>
      <label className="country-select-label">
        <span>{label}</span>
        <span className="country-select-wrap">
          <select value={value} onChange={(event) => onChange(event.target.value)}>
            <option value="">Choose a country</option>
            {countries.map(({ name, slug }) => <option key={slug} value={slug}>{name}</option>)}
          </select>
          <ChevronDown aria-hidden="true" />
        </span>
      </label>
      <div className="plug-stage">
        {country ? (
          <>
            <div className="plug-stage__visuals">
              {country.plugTypes.map((type) => <PlugIllustration key={type} type={type} className="plug-hero" />)}
            </div>
            <p><span aria-hidden="true">{country.flag}</span> {country.name} · Type {country.plugTypes.join(" / ")}</p>
          </>
        ) : <p className="plug-placeholder">Your plug shape will appear here.</p>}
      </div>
      <div className="country-panel__actions">{children}</div>
    </article>
  );
}
