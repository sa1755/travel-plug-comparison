"use client";

import { ArrowLeftRight, CircleCheck, Compass, LocateFixed, RotateCcw, ShieldCheck, TriangleAlert } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { PlugIllustration } from "@/components/comparison/plug-illustration";
import { TripResult } from "@/components/comparison/trip-result";
import { CountryCombobox } from "@/components/country/country-combobox";
import { HeroDeskGlobe } from "@/components/globe/hero-desk-globe";
import { compareCountries } from "@/lib/comparison";
import { trackEvent } from "@/lib/analytics";
import type { DeviceRecord } from "@/services/device-service";
import type { PlugType } from "@/types";

const GlobeExplorer = dynamic(
  () => import("@/components/globe/globe-explorer").then((module) => module.GlobeExplorer),
  {
    ssr: false,
    loading: () => (
      <div className="globe-loading" role="dialog" aria-modal="true" aria-label="Loading globe explorer">
        <div className="globe-loading__orb" aria-hidden="true" />
        <p><strong>Opening the world…</strong><span>Loading the interactive globe and major cities.</span></p>
      </div>
    ),
  },
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
  readonly aliases: readonly string[];
}

interface TravelPlugJourneyProps {
  readonly countries: readonly JourneyCountry[];
  readonly devices: readonly DeviceRecord[];
  readonly initialFrom?: string;
  readonly initialTo?: string;
  readonly mode?: "home" | "result";
}

const HOME_KEY = "travelplug-home-country";

export function TravelPlugJourney({ countries, devices, initialFrom, initialTo, mode = "home" }: TravelPlugJourneyProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [fromSlug, setFromSlug] = useState(initialFrom ?? "");
  const [toSlug, setToSlug] = useState(initialTo ?? "");
  const [locationStatus, setLocationStatus] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [globeOpen, setGlobeOpen] = useState(false);
  const lastGlobeTriggerRef = useRef<HTMLButtonElement>(null);
  const comparisonStartedRef = useRef(false);
  const lastCompletedComparisonRef = useRef("");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const storedHome = initialFrom ? "" : localStorage.getItem(HOME_KEY) ?? "";
    const requestedDestination = initialTo ? "" : query.get("to") ?? "";
    // Browser-only preferences are intentionally restored after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (storedHome) setFromSlug(storedHome);
    if (requestedDestination && countries.some(({ slug }) => slug === requestedDestination)) setToSlug(requestedDestination);
    if (query.get("explore") === "globe") setGlobeOpen(true);
  }, [countries, initialFrom, initialTo]);

  const origin = countries.find(({ slug }) => slug === fromSlug);
  const destination = countries.find(({ slug }) => slug === toSlug);
  const result = useMemo(
    () => origin && destination && origin.code !== destination.code
      ? compareCountries(origin, destination, devices)
      : undefined,
    [devices, origin, destination],
  );
  const initialOrigin = initialFrom ? countries.find(({ slug }) => slug === initialFrom) : undefined;
  const initialDestination = initialTo ? countries.find(({ slug }) => slug === initialTo) : undefined;
  const displayedTrip = result && origin && destination
    ? { origin, destination, result }
    : mode === "result" && initialOrigin && initialDestination
      ? { origin: initialOrigin, destination: initialDestination, result: compareCountries(initialOrigin, initialDestination, devices) }
      : undefined;

  useEffect(() => {
    if (!origin || !destination || origin.code === destination.code) return;
    const nextPath = `/compare/${origin.slug}/${destination.slug}`;
    if (pathname === nextPath) return;
    if (pathname === "/") router.push(nextPath, { scroll: false });
    else router.replace(nextPath, { scroll: false });
  }, [destination, origin, pathname, router]);

  useEffect(() => {
    if (!result || !origin || !destination) return;
    const comparisonKey = `${origin.slug}:${destination.slug}`;
    if (lastCompletedComparisonRef.current === comparisonKey) return;
    lastCompletedComparisonRef.current = comparisonKey;
    trackEvent("comparison_completed", {
      origin_country: origin.slug,
      destination_country: destination.slug,
      origin_plug_type: origin.plugTypes.join("/"),
      destination_socket_type: destination.plugTypes.join("/"),
      adapter_required: result.plug.status !== "not-required",
      converter_required: result.voltage.status === "converter-may-be-required",
    });
  }, [destination, origin, result]);

  const markComparisonStarted = () => {
    if (comparisonStartedRef.current) return;
    comparisonStartedRef.current = true;
    trackEvent("comparison_started", { entry_point: mode });
  };

  const rememberOrigin = (slug: string) => {
    if (slug) {
      markComparisonStarted();
      trackEvent("origin_country_selected", { origin_country: slug });
    }
    setFromSlug(slug);
    setLocationStatus("");
    if (slug) localStorage.setItem(HOME_KEY, slug);
    else localStorage.removeItem(HOME_KEY);
    if (slug === toSlug) setToSlug("");
  };

  const chooseDestination = (slug: string) => {
    if (slug && slug !== fromSlug) {
      markComparisonStarted();
      trackEvent("destination_country_selected", { destination_country: slug });
    }
    setToSlug(slug === fromSlug ? "" : slug);
  };

  const closeGlobe = () => {
    setGlobeOpen(false);
    window.requestAnimationFrame(() => {
      (lastGlobeTriggerRef.current ?? document.getElementById("journey-title"))?.focus();
    });
  };

  const openGlobe = (event: React.MouseEvent<HTMLButtonElement>) => {
    lastGlobeTriggerRef.current = event.currentTarget;
    setGlobeOpen(true);
  };

  const swapCountries = () => {
    if (!origin || !destination) return;
    trackEvent("countries_swapped", {
      origin_country: origin.slug,
      destination_country: destination.slug,
    });
    setFromSlug(destination.slug);
    setToSlug(origin.slug);
    localStorage.setItem(HOME_KEY, destination.slug);
  };

  const detectLocation = () => {
    if (isLocating) return;
    setIsLocating(true);
    setLocationStatus("Finding your country…");
    if (!("geolocation" in navigator)) {
      setIsLocating(false);
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
        trackEvent("error_encountered", { error_type: "precise_location_match_failed" });
        setLocationStatus("We could not match your position. Choose your country below.");
      } finally {
        setIsLocating(false);
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
        trackEvent("error_encountered", { error_type: "approximate_location_failed" });
        setLocationStatus("Location permission was not granted. Choose your country below.");
      } finally {
        setIsLocating(false);
      }
    }, { enableHighAccuracy: false, timeout: 10_000, maximumAge: 86_400_000 });
  };

  const panels = (
    <>
      <div className="journey-grid">
        <CountryPanel eyebrow="Home" label="Where are you travelling from?" value={fromSlug} countries={countries} country={origin} onChange={rememberOrigin}>
          {!origin ? (
            <button type="button" className="location-button" onClick={detectLocation} disabled={isLocating}>
              <LocateFixed aria-hidden="true" /> {isLocating ? "Finding your country…" : "Use my location"}
            </button>
          ) : (
            <button type="button" className="text-button" onClick={() => rememberOrigin("")}>
              <RotateCcw aria-hidden="true" /> Change home country
            </button>
          )}
          {locationStatus ? <p className="location-status" role="status">{locationStatus}</p> : null}
        </CountryPanel>

        <CountryPanel eyebrow="Destination" label="Where are you travelling to?" value={toSlug} countries={countries.filter(({ slug }) => slug !== fromSlug)} country={destination} onChange={chooseDestination}>
          <button type="button" className="globe-button" onClick={openGlobe}>
            <Compass aria-hidden="true" /> Open globe view
          </button>
        </CountryPanel>
      </div>
      {origin && destination ? (
        <button type="button" className="swap-button" onClick={swapCountries}>
          <ArrowLeftRight aria-hidden="true" /> Swap countries
        </button>
      ) : null}
    </>
  );

  return (
    <section id="compare" className="journey-shell" aria-labelledby="journey-title">
      {mode === "result" && displayedTrip ? (
        <>
          <h1 id="journey-title" className="sr-only" tabIndex={-1}>Travel power result</h1>
          <TripResult origin={displayedTrip.origin} destination={displayedTrip.destination} result={displayedTrip.result} />
          <details className="change-journey">
            <summary>Change or swap countries</summary>
            {panels}
          </details>
        </>
      ) : (
        <>
          <div className="journey-intro">
            <div className="journey-intro__copy">
              <p className="section-label">Plug confidence, worldwide</p>
              <h1 id="journey-title" tabIndex={-1}>Does your charger work abroad? Check before you fly.</h1>
              <p>Compare any two countries and see whether you need a plug adapter, a voltage converter, or nothing at all.</p>
            </div>
            <button type="button" className="hero-globe-link" onClick={openGlobe}>
              <HeroDeskGlobe />
              <span>Explore destinations<strong>Open Globe view</strong></span>
            </button>
          </div>
          {panels}
          {result && origin && destination ? <TripResult origin={origin} destination={destination} result={result} compact /> : null}
        </>
      )}

      <section id="safety" className="safety-guide" aria-labelledby="safety-title">
        <div className="safety-guide__intro">
          <ShieldCheck aria-hidden="true" />
          <div>
            <p className="section-label">Power safety</p>
            <h2 id="safety-title">Check the label before you plug in.</h2>
            <p>A plug adapter only changes the plug shape. It does not make a different voltage safe.</p>
          </div>
        </div>
        <div className="safety-guide__steps">
          <article>
            <CircleCheck aria-hidden="true" />
            <div><h3>Find the input rating</h3><p>Look on the device, charger, or power brick for the word “INPUT”.</p></div>
          </article>
          <article>
            <CircleCheck aria-hidden="true" />
            <div><h3>Read the voltage range</h3><p>“100–240V, 50/60Hz” usually means it can accept common worldwide supplies, though a plug adapter may still be needed.</p></div>
          </article>
          <article className="safety-guide__warning">
            <TriangleAlert aria-hidden="true" />
            <div><h3>Be careful with high-power devices</h3><p>Never connect a device unless its INPUT range includes the destination voltage. For hair tools, heating appliances, or medical equipment, use the manufacturer-approved solution or ask a qualified retailer or electrician.</p></div>
          </article>
        </div>
        <Link href="/device-checker" className="primary-pill">Check a specific device</Link>
      </section>

      {globeOpen ? (
        <GlobeExplorer countries={countries} excludedSlug={fromSlug} onClose={closeGlobe} onSelect={(slug) => { chooseDestination(slug); closeGlobe(); }} />
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
    <article className={`country-panel${country ? " country-panel--selected" : ""}`}>
      <p className="country-panel__eyebrow">{eyebrow}</p>
      <div className="country-select-label">
        <span>{label}</span>
        <CountryCombobox label={label} value={value} countries={countries} onChange={onChange} />
      </div>
      <div className="plug-stage">
        {country ? (
          <>
            <div className="plug-stage__visuals">
              {country.plugTypes.slice(0, 3).map((type) => <PlugIllustration key={type} type={type} className="plug-hero" />)}
            </div>
            <p><span aria-hidden="true">{country.flag}</span> {country.name} · Type {country.plugTypes.join(" / ")}</p>
          </>
        ) : <p className="plug-placeholder">Your plug shape will appear here.</p>}
      </div>
      <div className="country-panel__actions">{children}</div>
    </article>
  );
}
