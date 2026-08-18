"use client";

import { Camera, Gamepad2, HeartPulse, Laptop, RotateCcw, ShieldCheck, Smartphone, Sparkles, Watch, Wind, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { CompatibilityBadge } from "@/components/comparison/compatibility-badge";
import { CountryCombobox } from "@/components/country/country-combobox";
import { compareCountries } from "@/lib/comparison";
import { trackEvent } from "@/lib/analytics";
import { deviceCheckerFormSchema } from "@/lib/schemas";
import type { CountryRecord } from "@/services/country-service";
import type { DeviceRecord } from "@/services/device-service";
import type {
  ComparisonResult,
  DeviceCheckerFormValues,
} from "@/types";

interface DeviceCheckerProps {
  readonly countries: readonly CountryRecord[];
  readonly devices: readonly DeviceRecord[];
  readonly defaultFrom?: string;
  readonly defaultTo?: string;
}

interface SubmittedResult {
  readonly key: string;
  readonly origin: CountryRecord;
  readonly destination: CountryRecord;
  readonly result: ComparisonResult;
}

const deviceIcons = {
  "phone-charger": Smartphone,
  laptop: Laptop,
  smartwatch: Watch,
  "camera-charger": Camera,
  "electric-toothbrush": Sparkles,
  "hair-dryer": Wind,
  "hair-straightener": Zap,
  "gaming-console": Gamepad2,
  "cpap-machine": HeartPulse,
} as const;

export function DeviceChecker({ countries, devices, defaultFrom = "", defaultTo = "" }: DeviceCheckerProps) {
  const [submitted, setSubmitted] = useState<SubmittedResult | null>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const {
    clearErrors,
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<DeviceCheckerFormValues>({
    defaultValues: { fromCountry: defaultFrom, toCountry: defaultTo, deviceId: "" },
  });
  const values = useWatch({ control });
  const currentKey = `${values.fromCountry ?? ""}:${values.toCountry ?? ""}:${values.deviceId ?? ""}`;
  const visibleResult = submitted?.key === currentKey ? submitted : null;
  useEffect(() => {
    if (visibleResult) resultHeadingRef.current?.focus();
  }, [visibleResult]);

  useEffect(() => {
    trackEvent("device_checker_opened");
  }, []);

  const checkDevice = (formValues: DeviceCheckerFormValues) => {
    clearErrors();
    const parsed = deviceCheckerFormSchema.safeParse(formValues);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field === "fromCountry" || field === "toCountry" || field === "deviceId") {
          setError(field, { message: issue.message });
        }
      });
      return;
    }

    const origin = countries.find((country) => country.slug === parsed.data.fromCountry);
    const destination = countries.find((country) => country.slug === parsed.data.toCountry);
    const device = devices.find((item) => item.id === parsed.data.deviceId);
    if (!origin || !destination || !device) {
      setError("deviceId", { message: "That selection is no longer available" });
      return;
    }

    const result = compareCountries(origin, destination, [device]);
    setSubmitted({
      key: `${origin.slug}:${destination.slug}:${device.id}`,
      origin,
      destination,
      result,
    });
    trackEvent("device_checked", {
      device_category: device.id,
      compatibility_result: result.devices[0]?.level ?? result.level,
      origin_country: origin.slug,
      destination_country: destination.slug,
    });
  };

  const startOver = () => {
    reset();
    setSubmitted(null);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <form onSubmit={handleSubmit(checkDevice)} noValidate className="rounded-[1.75rem] border bg-surface p-5 shadow-card sm:p-7">
        <div>
          <p className="text-sm font-bold">Where does your device come from?</p>
          <p className="mt-1 text-sm text-muted">Use the country where it is normally connected.</p>
          <Controller control={control} name="fromCountry" rules={{ required: "Choose where your device comes from" }} render={({ field }) => (
            <CountryCombobox label="Where does your device come from?" value={field.value} countries={countries} onChange={field.onChange} invalid={Boolean(errors.fromCountry)} errorId={errors.fromCountry ? "from-country-error" : undefined} />
          )} />
          {errors.fromCountry ? <p id="from-country-error" className="mt-2 text-sm font-semibold text-danger" role="alert">{errors.fromCountry.message}</p> : null}
        </div>
        <div className="mt-5">
          <p className="text-sm font-bold">Where will you use it?</p>
          <p className="mt-1 text-sm text-muted">Choose the destination power supply.</p>
          <Controller control={control} name="toCountry" rules={{ required: "Choose where you will use it" }} render={({ field }) => (
            <CountryCombobox label="Where will you use it?" value={field.value} countries={countries} onChange={field.onChange} invalid={Boolean(errors.toCountry)} errorId={errors.toCountry ? "to-country-error" : undefined} />
          )} />
          {errors.toCountry ? <p id="to-country-error" className="mt-2 text-sm font-semibold text-danger" role="alert">{errors.toCountry.message}</p> : null}
        </div>

        <fieldset className="mt-6">
          <legend className="text-sm font-bold">Which device are you taking?</legend>
          <p className="mt-1 text-sm text-muted">Choose the closest general profile.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {devices.map((device) => {
              const Icon = deviceIcons[device.id as keyof typeof deviceIcons] ?? ShieldCheck;
              return (
                <label key={device.id} className="relative flex min-h-14 cursor-pointer items-center rounded-2xl border bg-surface px-4 transition-colors has-checked:border-brand has-checked:bg-brand-faint">
                  <input type="radio" value={device.id} {...register("deviceId", { required: "Choose a device" })} className="mr-3 size-4 accent-brand" />
                  <Icon className="mr-2 size-5 text-olive" aria-hidden="true" />
                  <span className="text-sm font-semibold">{device.name}</span>
                </label>
              );
            })}
          </div>
          {errors.deviceId ? <p className="mt-2 text-sm font-semibold text-danger" role="alert">{errors.deviceId.message}</p> : null}
        </fieldset>

        <button type="submit" className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 font-bold text-white hover:bg-brand-strong">
          Check this device
        </button>
      </form>

      <div aria-live="polite" aria-atomic="true">
        {visibleResult ? (
          <section className="rounded-[1.75rem] border bg-surface p-6 shadow-card sm:p-8" aria-labelledby="device-result-title">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="section-label">Your device guidance</p>
                <h2 ref={resultHeadingRef} tabIndex={-1} id="device-result-title" className="mt-2 text-2xl font-bold tracking-tight outline-none sm:text-3xl">
                  <span aria-hidden="true">{visibleResult.origin.flag}</span> {visibleResult.origin.name} to <span aria-hidden="true">{visibleResult.destination.flag}</span> {visibleResult.destination.name}
                </h2>
              </div>
              <CompatibilityBadge
                level={visibleResult.result.devices[0].level === "safe" && visibleResult.result.plug.status !== "not-required" ? "warning" : visibleResult.result.devices[0].level}
                label={visibleResult.result.devices[0].level === "danger"
                  ? "Do not plug in yet"
                  : visibleResult.result.devices[0].level === "warning"
                    ? "Check the label"
                    : visibleResult.result.plug.status !== "not-required"
                      ? "Adapter needed"
                      : "Likely works"}
              />
            </div>
            <div className="mt-6 rounded-2xl bg-surface-muted p-5">
              <h3 className="text-xl font-bold">
                {visibleResult.result.devices[0].level === "danger"
                  ? "Do not connect it until you confirm the voltage"
                  : visibleResult.result.devices[0].level === "warning"
                    ? "Check the device label before use"
                    : visibleResult.result.plug.status !== "not-required"
                      ? "It is likely compatible — bring a plug adapter"
                      : "It is likely compatible"}
              </h3>
              <p className="mt-3 leading-7 text-muted">{visibleResult.result.devices[0].summary}</p>
              {visibleResult.result.plug.status !== "not-required" ? <p className="mt-3 font-semibold text-brand-strong">{visibleResult.result.plug.summary}</p> : null}
              <details className="mt-4 border-t pt-4 text-sm">
                <summary className="cursor-pointer font-semibold text-brand-strong">What to check on the label</summary>
                <p className="mt-2 leading-6 text-muted">{visibleResult.result.devices[0].guidance}</p>
              </details>
            </div>
            <div className="mt-5 rounded-2xl bg-warning-soft/60 p-4 text-sm leading-6 text-warning">
              This is general guidance, not a guarantee. The exact rating label and manufacturer instructions are the final authority—especially for medical and high-power devices.
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/compare/${visibleResult.origin.slug}/${visibleResult.destination.slug}`} className="inline-flex min-h-11 items-center rounded-full bg-brand-soft px-4 text-sm font-bold text-brand-strong">View the full trip guide</Link>
              <button type="button" onClick={startOver} className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-muted hover:bg-surface-muted"><RotateCcw className="size-4" aria-hidden="true" /> Start over</button>
            </div>
          </section>
        ) : (
          <section className="hidden min-h-80 items-center rounded-[1.75rem] border border-dashed border-border-strong bg-surface-muted p-7 lg:flex" aria-labelledby="device-empty-title">
            <div className="max-w-md">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong"><ShieldCheck className="size-6" aria-hidden="true" /></span>
              <h2 id="device-empty-title" className="mt-5 text-2xl font-bold tracking-tight">Your answer will appear here</h2>
              <p className="mt-3 leading-7 text-muted">Choose two countries and a device. We will explain the likely voltage and frequency considerations without assuming every model is the same.</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
