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
  readonly label: string;
  readonly value: string;
  readonly countries: readonly SearchableCountry[];
  readonly onChange: (slug: string) => void;
}

export function CountryCombobox({ label, value, countries, onChange }: CountryComboboxProps) {
  const selected = countries.find(({ slug }) => slug === value);
  const [query, setQuery] = useState(selected?.name ?? "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listId = useId();
  const hintId = useId();
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
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  const choose = (slug: string) => {
    const country = countries.find((candidate) => candidate.slug === slug);
    setQuery(country?.name ?? "");
    setOpen(false);
    onChange(slug);
  };

  return (
    <div ref={rootRef} className="country-combobox">
      <p id={hintId} className="country-combobox__hint">
        Start typing a country name, or choose one from the list.
      </p>
      <div className="country-combobox__control">
        <Search aria-hidden="true" />
        <input
          type="search"
          role="combobox"
          aria-label={label}
          aria-expanded={open}
          aria-controls={listId}
          aria-describedby={hintId}
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
              setActiveIndex((index) => Math.max(0, index - 1));
            } else if (event.key === "Enter" && open && results[activeIndex]) {
              event.preventDefault();
              choose(results[activeIndex].slug);
            } else if (event.key === "Escape") {
              setOpen(false);
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
      {open ? (
        <div id={listId} role="listbox" aria-label={`${label} results`} className="country-combobox__list">
          {results.length ? results.map((country, index) => (
            <button
              id={`${listId}-${country.slug}`}
              type="button"
              role="option"
              aria-selected={country.slug === value}
              key={country.slug}
              onPointerDown={(event) => event.preventDefault()}
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
