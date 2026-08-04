import { ChevronDown, MapPin } from "lucide-react";
import type { SelectHTMLAttributes } from "react";

export interface CountryOption {
  readonly name: string;
  readonly slug: string;
  readonly flag: string;
}

interface CountrySelectorProps {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly options: readonly CountryOption[];
  readonly error?: string;
  readonly selectProps: Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "children">;
}

export function CountrySelector({
  id,
  label,
  description,
  options,
  error,
  selectProps,
}: CountrySelectorProps) {
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-foreground">
        {label}
      </label>
      <p id={descriptionId} className="mt-1 text-sm text-muted">
        {description}
      </p>
      <div className="relative mt-3">
        <MapPin
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-brand"
          aria-hidden="true"
        />
        <select
          {...selectProps}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${descriptionId}${error ? ` ${errorId}` : ""}`}
          className="min-h-13 w-full appearance-none rounded-2xl border border-border-strong bg-surface py-3 pl-12 pr-11 text-base font-medium text-foreground shadow-sm transition-colors hover:border-brand/50 aria-invalid:border-danger aria-invalid:bg-danger-soft/30"
        >
          <option value="">Choose a country</option>
          {options.map((country) => (
            <option key={country.slug} value={country.slug}>
              {country.flag} {country.name}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
      </div>
      {error ? (
        <p id={errorId} className="mt-2 text-sm font-semibold text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
