"use client";

import { Search, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

export interface SearchableCountry {
  readonly name: string;
  readonly slug: string;
  readonly code: string;
  readonly flag: string;
  readonly aliases: readonly string[];
}

interface CountryComboboxProps {
  readonly id?: string;
  readonly label: string;
  readonly value: string;
  readonly countries: readonly SearchableCountry[];
  readonly onChange: (slug: string) => void;
  readonly invalid?: boolean;
  readonly errorId?: string;
}

export function CountryCombobox({ id, label, value, countries, onChange, invalid = false, errorId }: CountryComboboxProps) {
  const selected = countries.find(({ slug }) => slug === value);
  const [query, setQuery] = useState(selected?.name ?? "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listId = useId();
  const hintId = useId();
  const statusId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const results = useMemo(() => {
    if (!normalizedQuery) return countries.slice(0, 10);
    return countries.filter(({ name, code, aliases }) =>
      [name, code, ...aliases].some((candidate) => candidate.toLocaleLowerCase().includes(normalizedQuery)),
    ).slice(0, 10);
  }, [countries, normalizedQuery]);

  useEffect(() => {
    if (!open) {
      // Keep externally driven swaps and route changes reflected in the field.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery(selected?.name ?? "");
    }
  }, [open, selected?.name]);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    document.getElementById(`${listId}-${results[activeIndex]?.slug}`)?.scrollIntoView?.({ block: "nearest" });
  }, [activeIndex, listId, open, results]);

  const choose = (slug: string) => {
    const country = countries.find((candidate) => candidate.slug === slug);
    setQuery(country?.name ?? "");
    setOpen(false);
    setActiveIndex(-1);
    onChange(slug);
  };

  return (
    <div
      ref={rootRef}
      className={`country-combobox${open ? " is-open" : ""}`}
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
        setOpen(false);
        setActiveIndex(-1);
        setQuery(selected?.name ?? "");
      }}
    >
      <p id={hintId} className="country-combobox__hint">
        Type or choose a country.
      </p>
      <div className="country-combobox__control">
        <Search aria-hidden="true" />
        <input
          id={id}
          type="search"
          role="combobox"
          aria-label={label}
          aria-expanded={open}
          aria-controls={listId}
          aria-describedby={[hintId, statusId, errorId].filter(Boolean).join(" ")}
          aria-invalid={invalid || undefined}
          aria-autocomplete="list"
          aria-activedescendant={open && results[activeIndex] ? `${listId}-${results[activeIndex].slug}` : undefined}
          value={query}
          placeholder="Type a country name…"
          autoComplete="off"
          onFocus={(event) => { event.currentTarget.select(); setOpen(true); }}
          onClick={(event) => { if (query === selected?.name) event.currentTarget.select(); }}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(-1);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
              setActiveIndex((index) => Math.min(index + 1, Math.max(0, results.length - 1)));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setOpen(true);
              setActiveIndex((index) => index < 0 ? Math.max(0, results.length - 1) : Math.max(0, index - 1));
            } else if (event.key === "Enter" && open && results[activeIndex]) {
              event.preventDefault();
              choose(results[activeIndex].slug);
            } else if (event.key === "Home" && open && results.length) {
              event.preventDefault();
              setActiveIndex(0);
            } else if (event.key === "End" && open && results.length) {
              event.preventDefault();
              setActiveIndex(results.length - 1);
            } else if (event.key === "Escape") {
              setOpen(false);
              setActiveIndex(-1);
              setQuery(selected?.name ?? "");
            } else if (event.key === "Tab") {
              setOpen(false);
              setActiveIndex(-1);
              setQuery(selected?.name ?? "");
            }
          }}
        />
        {query ? (
          <button type="button" aria-label={`Clear ${label.toLocaleLowerCase()}`} onClick={() => choose("")}>
            <X aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <p id={statusId} className="sr-only" aria-live="polite">
        {open ? `${results.length} ${results.length === 1 ? "country" : "countries"} shown.` : ""}
      </p>
      {open ? (
        <div id={listId} role="listbox" aria-label={`${label} results`} className="country-combobox__list">
          {results.length ? results.map((country, index) => (
            <button
              id={`${listId}-${country.slug}`}
              type="button"
              role="option"
              tabIndex={-1}
              aria-selected={country.slug === value}
              key={country.slug}
              onPointerDown={(event) => event.preventDefault()}
              onPointerMove={() => setActiveIndex(index)}
              onClick={() => choose(country.slug)}
              className={index === activeIndex ? "is-active" : undefined}
            >
              <span aria-hidden="true">{country.flag}</span>
              <span>{country.name}</span>
              <small>{country.code}</small>
            </button>
          )) : <p>No matching country. Try a name or two-letter code.</p>}
        </div>
      ) : null}
    </div>
  );
}
