import {
  ArrowRight,
  Camera,
  Check,
  Gamepad2,
  Laptop,
  PlugZap,
  ShieldAlert,
  Smartphone,
  Sparkles,
  Watch,
  Wind,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { AdapterRecommendations } from "@/components/affiliate/adapter-recommendations";
import { CompatibilityBadge } from "@/components/comparison/compatibility-badge";
import { PlugIllustration } from "@/components/comparison/plug-illustration";
import type { JourneyCountry } from "@/components/comparison/travel-plug-journey";
import type { ComparisonResult, DeviceComparison } from "@/types";
import { formatElectricalValues } from "@/utils/format-electrical-values";

interface TripResultProps {
  readonly origin: JourneyCountry;
  readonly destination: JourneyCountry;
  readonly result: ComparisonResult;
  readonly compact?: boolean;
}

const devicePresentation = {
  "phone-charger": { label: "Phone", icon: Smartphone },
  laptop: { label: "Laptop", icon: Laptop },
  smartwatch: { label: "Smartwatch", icon: Watch },
  "camera-charger": { label: "Camera", icon: Camera },
  "electric-toothbrush": { label: "Electric toothbrush", icon: Sparkles },
  "hair-dryer": { label: "Hair dryer", icon: Wind },
  "hair-straightener": { label: "Hair straightener", icon: Zap },
  "gaming-console": { label: "Gaming console", icon: Gamepad2 },
} as const;

function getVerdict(result: ComparisonResult) {
  if (result.voltage.status === "converter-may-be-required") {
    return {
      level: "danger" as const,
      kicker: "Voltage check required",
      title: "A voltage converter may be required",
      icon: ShieldAlert,
    };
  }
  if (result.voltage.status === "variable-destination") {
    return {
      level: "warning" as const,
      kicker: "Before you plug in",
      title: "Confirm the local voltage",
      icon: ShieldAlert,
    };
  }
  if (result.voltage.status === "check-device") {
    return {
      level: "warning" as const,
      kicker: "Before you plug in",
      title: "Check the device label",
      icon: ShieldAlert,
    };
  }
  if (result.plug.status === "required" || result.plug.status === "check-specific-plug") {
    return {
      level: "warning" as const,
      kicker: "Bring",
      title: "A plug adapter",
      icon: PlugZap,
    };
  }
  if (result.voltage.status !== "same" || result.frequency.status !== "same") {
    return {
      level: "warning" as const,
      kicker: "Before you plug in",
      title: "Check the device label",
      icon: ShieldAlert,
    };
  }
  return {
    level: "safe" as const,
    kicker: "Good news",
    title: "No plug adapter required",
    icon: Check,
  };
}

function getDeviceStatus(device: DeviceComparison, result: ComparisonResult) {
  if (device.level === "danger") return { label: "Do not connect yet", level: "danger" as const };
  if (device.level === "warning") return { label: "Check label", level: "warning" as const };
  if (result.plug.status !== "not-required") return { label: "Adapter needed", level: "warning" as const };
  return { label: "Works", level: "safe" as const };
}

export function TripResult({ origin, destination, result, compact = false }: TripResultProps) {
  const verdict = getVerdict(result);
  const VerdictIcon = verdict.icon;
  const plugFits = result.plug.status === "not-required";
  const plugMessage = result.plug.status === "required"
    ? `Your ${origin.name} plug will not fit. Bring an adapter for Type ${destination.plugTypes.join("/")} sockets.`
    : result.plug.status === "check-specific-plug"
      ? `Some ${origin.name} plugs may fit, but others need an adapter for Type ${destination.plugTypes.join("/")} sockets.`
      : `Your ${origin.name} plug should fit sockets in ${destination.name}.`;

  return (
    <section className={compact ? "trip-result trip-result--compact" : "trip-result"} aria-labelledby="trip-result-title" aria-live="polite">
      <div className={`trip-answer trip-answer--${verdict.level}`}>
        <span className="answer-icon" aria-hidden="true"><VerdictIcon /></span>
        <div>
          <p className="trip-route">
            <span aria-hidden="true">{origin.flag}</span> {origin.name}
            <span aria-hidden="true" className="trip-route__arrow">→</span>
            <span className="sr-only"> to </span>
            <span aria-hidden="true">{destination.flag}</span> {destination.name}
          </p>
          <p className="answer-kicker">{verdict.kicker}</p>
          <h2 id="trip-result-title">{verdict.title}</h2>
          <p>{plugMessage}</p>
          {result.voltage.status === "converter-may-be-required" ? (
            <>
              <p>Most modern phone and laptop chargers still work if their label says 100–240 V, 50/60 Hz. High-powered appliances may need a suitable converter.</p>
              <ul className="trip-actions-list">
                {!plugFits ? <li><Check aria-hidden="true" /> Bring a plug adapter</li> : null}
                <li><Check aria-hidden="true" /> Check every device for the destination voltage</li>
              </ul>
            </>
          ) : null}
          {result.voltage.status === "variable-destination" ? (
            <ul className="trip-actions-list">
              {!plugFits ? <li><Check aria-hidden="true" /> Bring a plug adapter</li> : null}
              <li><Check aria-hidden="true" /> Ask your accommodation which voltage its socket supplies</li>
              <li><Check aria-hidden="true" /> Confirm every device label includes that voltage</li>
            </ul>
          ) : null}
        </div>
      </div>

      <div className="socket-comparison" aria-label={`${origin.name} and ${destination.name} plug and socket types`}>
        <article>
          <p>Plug/socket type at home</p>
          <div className="socket-comparison__visuals">
            {origin.plugTypes.slice(0, 3).map((type) => <PlugIllustration key={type} type={type} className="socket-comparison__plug" />)}
          </div>
          <strong><span aria-hidden="true">{origin.flag}</span> {origin.name}</strong>
          <small>Type {origin.plugTypes.join(" / ")}</small>
        </article>
        <ArrowRight className="socket-comparison__arrow" aria-hidden="true" />
        <article>
          <p>Plug/socket type at destination</p>
          <div className="socket-comparison__visuals">
            {destination.plugTypes.slice(0, 3).map((type) => <PlugIllustration key={type} type={type} className="socket-comparison__plug" />)}
          </div>
          <strong><span aria-hidden="true">{destination.flag}</span> {destination.name}</strong>
          <small>Type {destination.plugTypes.join(" / ")}</small>
        </article>
      </div>

      <div className="trip-result__actions">
        <Link href={`/device-checker?from=${origin.slug}&to=${destination.slug}`} className="primary-pill">Check a specific device</Link>
        <Link href={`/country/${destination.slug}`} className="secondary-pill">Open {destination.name} guide</Link>
      </div>

      <details className="technical-disclosure">
        <summary>Plug, voltage and frequency details</summary>
        <dl>
          <div><dt>Plug fit</dt><dd>{result.plug.summary}</dd></div>
          <div><dt>Voltage</dt><dd>{formatElectricalValues(origin.voltages, "V")} → {formatElectricalValues(destination.voltages, "V")}. {result.voltage.summary}</dd></div>
          <div><dt>Frequency</dt><dd>{formatElectricalValues(origin.frequencies, "Hz")} → {formatElectricalValues(destination.frequencies, "Hz")}. {result.frequency.summary}</dd></div>
        </dl>
      </details>

      {result.plug.status !== "not-required" ? (
        <AdapterRecommendations origin={origin} destination={destination} />
      ) : null}

      {result.devices.length ? (
        <div className="device-results" aria-labelledby="device-results-title">
          <div className="device-results__intro">
            <p className="section-label">Your devices</p>
            <h3 id="device-results-title">What is likely to work?</h3>
            <p>These are cautious general results. The input label on your exact device always comes first.</p>
          </div>
          <div className="device-result-grid">
            {result.devices.map((device) => {
              const presentation = devicePresentation[device.deviceId as keyof typeof devicePresentation];
              if (!presentation) return null;
              const Icon = presentation.icon;
              const status = getDeviceStatus(device, result);
              return (
                <article key={device.deviceId} className="device-result-card">
                  <div className="device-result-card__top">
                    <span className="device-result-card__icon"><Icon aria-hidden="true" /></span>
                    <CompatibilityBadge level={status.level} label={status.label} />
                  </div>
                  <h4>{presentation.label}</h4>
                  <p>{device.summary}</p>
                  {!plugFits ? <p className="device-result-card__adapter">A plug adapter is also needed.</p> : null}
                </article>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
