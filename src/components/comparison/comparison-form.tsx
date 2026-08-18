"use client";

import { ArrowRight, ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";

import {
  CountrySelector,
  type CountryOption,
} from "@/components/country/country-selector";
import { comparisonFormSchema } from "@/lib/schemas";
import { trackEvent } from "@/lib/analytics";
import type { ComparisonFormValues } from "@/types";

interface ComparisonFormProps {
  readonly countries: readonly CountryOption[];
  readonly defaultFrom?: string;
  readonly defaultTo?: string;
  readonly submitLabel?: string;
}

export function ComparisonForm({
  countries,
  defaultFrom = "",
  defaultTo = "",
  submitLabel = "Compare countries",
}: ComparisonFormProps) {
  const router = useRouter();
  const [isNavigating, startTransition] = useTransition();
  const {
    clearErrors,
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    setError,
    setValue,
  } = useForm<ComparisonFormValues>({
    defaultValues: {
      fromCountry: defaultFrom,
      toCountry: defaultTo,
    },
  });

  const fromCountry = useWatch({ control, name: "fromCountry" });
  const toCountry = useWatch({ control, name: "toCountry" });

  const submitComparison = (values: ComparisonFormValues) => {
    const result = comparisonFormSchema.safeParse(values);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field === "fromCountry" || field === "toCountry") {
          setError(field, { message: issue.message });
        }
      });
      return;
    }

    startTransition(() => {
      trackEvent("comparison_started", { entry_point: "comparison_form" });
      trackEvent("comparison_completed", {
        origin_country: result.data.fromCountry,
        destination_country: result.data.toCountry,
      });
      router.push(`/compare/${result.data.fromCountry}/${result.data.toCountry}`);
    });
  };

  const swapCountries = () => {
    const origin = getValues("fromCountry");
    const destination = getValues("toCountry");
    if (origin || destination) {
      trackEvent("countries_swapped", {
        origin_country: origin || "not_selected",
        destination_country: destination || "not_selected",
      });
    }
    setValue("fromCountry", destination, { shouldDirty: true, shouldValidate: true });
    setValue("toCountry", origin, { shouldDirty: true, shouldValidate: true });
    clearErrors();
  };

  return (
    <form onSubmit={handleSubmit(submitComparison)} noValidate>
      <div className="space-y-5">
        <CountrySelector
          id="from-country"
          label="Where are you travelling from?"
          description="This is where your plugs and devices come from."
          options={countries}
          error={errors.fromCountry?.message}
          selectProps={{
            ...register("fromCountry", { required: "Choose where you are travelling from" }),
          }}
        />

        <div className="flex justify-center" aria-hidden={!fromCountry && !toCountry}>
          <button
            type="button"
            onClick={swapCountries}
            disabled={!fromCountry && !toCountry}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border-strong bg-surface px-4 text-sm font-semibold text-muted transition-colors hover:border-brand/40 hover:bg-brand-faint hover:text-brand-strong disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUpDown className="size-4" aria-hidden="true" />
            Swap countries
          </button>
        </div>

        <CountrySelector
          id="to-country"
          label="Where are you travelling to?"
          description="Choose the destination whose sockets you will use."
          options={countries}
          error={errors.toCountry?.message}
          selectProps={{
            ...register("toCountry", { required: "Choose your destination" }),
          }}
        />
      </div>

      <button
        type="submit"
        disabled={isNavigating}
        className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3 font-bold text-white shadow-sm transition-colors hover:bg-brand-strong disabled:cursor-wait disabled:opacity-70"
      >
        {isNavigating ? "Opening your guide…" : submitLabel}
        <ArrowRight className="size-5" aria-hidden="true" />
      </button>
    </form>
  );
}
