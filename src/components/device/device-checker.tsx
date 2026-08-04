"use client";

import { ArrowRight, RotateCcw, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { CompatibilityBadge } from "@/components/comparison/compatibility-badge";
import { CountrySelector } from "@/components/country/country-selector";
import { DeviceCard } from "@/components/device/device-card";
import { compareCountries } from "@/lib/comparison";
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
}

interface SubmittedResult {
  readonly key: string;
  readonly origin: CountryRecord;
  readonly destination: CountryRecord;
  readonly result: ComparisonResult;
}

export function DeviceChecker({ countries, devices }: DeviceCheckerProps) {
  const [submitted, setSubmitted] = useState<SubmittedResult | null>(null);
  const {
    clearErrors,
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<DeviceCheckerFormValues>({
    defaultValues: { fromCountry: "", toCountry: "", deviceId: "" },
  });
  const values = useWatch({ control });
  const currentKey = `${values.fromCountry ?? ""}:${values.toCountry ?? ""}:${values.deviceId ?? ""}`;
  const visibleResult = submitted?.key === currentKey ? submitted : null;
  const countryOptions = countries.map(({ name, slug, flag }) => ({ name, slug, flag }));

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

    setSubmitted({
      key: `${origin.slug}:${destination.slug}:${device.id}`,
      origin,
      destination,
      result: compareCountries(origin, destination, [device]),
    });
  };

  const startOver = () => {
    reset();
    setSubmitted(null);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <form onSubmit={handleSubmit(checkDevice)} noValidate className="rounded-[1.75rem] border bg-surface p-5 shadow-card sm:p-7">
        <CountrySelector
          id="device-from-country"
          label="Where does your device come from?"
          description="Use the country where it is normally connected."
          options={countryOptions}
          error={errors.fromCountry?.message}
          selectProps={{ ...register("fromCountry", { required: "Choose the device's home country" }) }}
        />
        <div className="mt-5">
          <CountrySelector
            id="device-to-country"
            label="Where will you use it?"
            description="Choose the destination power supply."
            options={countryOptions}
            error={errors.toCountry?.message}
            selectProps={{ ...register("toCountry", { required: "Choose your destination" }) }}
          />
        </div>

        <fieldset className="mt-6">
          <legend className="text-sm font-bold">Which device are you taking?</legend>
          <p className="mt-1 text-sm text-muted">Choose the closest general profile.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {devices.map((device) => (
              <label key={device.id} className="relative flex min-h-14 cursor-pointer items-center rounded-2xl border bg-surface px-4 transition-colors has-checked:border-brand has-checked:bg-brand-faint">
                <input type="radio" value={device.id} {...register("deviceId", { required: "Choose a device" })} className="mr-3 size-4 accent-brand" />
                <span className="text-sm font-semibold">{device.name}</span>
              </label>
            ))}
          </div>
          {errors.deviceId ? <p className="mt-2 text-sm font-semibold text-danger" role="alert">{errors.deviceId.message}</p> : null}
        </fieldset>

        <button type="submit" className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 font-bold text-white hover:bg-brand-strong">
          Check this device <ArrowRight className="size-5" aria-hidden="true" />
        </button>
      </form>

      <div aria-live="polite" aria-atomic="true">
        {visibleResult ? (
          <section className="rounded-[1.75rem] border bg-surface p-6 shadow-card sm:p-8" aria-labelledby="device-result-title">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="section-label">Your device guidance</p>
                <h2 id="device-result-title" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  <span aria-hidden="true">{visibleResult.origin.flag}</span> {visibleResult.origin.name} to <span aria-hidden="true">{visibleResult.destination.flag}</span> {visibleResult.destination.name}
                </h2>
              </div>
              <CompatibilityBadge level={visibleResult.result.devices[0].level} />
            </div>
            <div className="mt-6">
              <DeviceCard result={visibleResult.result.devices[0]} />
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
          <section className="flex min-h-80 items-center rounded-[1.75rem] border border-dashed border-border-strong bg-surface-muted p-7" aria-labelledby="device-empty-title">
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
