"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useEffect, useId, useRef, useState } from "react";

import {
  filterCatalogSearch,
  type CatalogSearchEntry,
} from "@/lib/catalog-search";

interface GlobalSearchProps {
  readonly entries: readonly CatalogSearchEntry[];
}

export function GlobalSearch({ entries }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const results = filterCatalogSearch(entries, deferredQuery);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();

    const closeOnPointerDown = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnPointerDown);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnPointerDown);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={panelRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="global-search-panel"
        className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-muted transition-colors hover:bg-surface-muted hover:text-foreground sm:px-4"
      >
        <Search className="size-4.5" aria-hidden="true" />
        <span className="hidden sm:inline">Search</span>
      </button>

      {isOpen ? (
        <div
          id="global-search-panel"
          className="fixed inset-x-4 top-18 z-50 rounded-3xl border bg-surface p-4 shadow-elevated sm:absolute sm:-right-2 sm:top-13 sm:left-auto sm:w-[28rem]"
        >
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-brand" aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                role="combobox"
                aria-label="Search countries and plug types"
                aria-controls={listId}
                aria-expanded={query.length > 0}
                aria-autocomplete="list"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search Japan, Type G, UAE…"
                className="min-h-12 w-full rounded-2xl border border-border-strong bg-surface-muted py-3 pl-12 pr-4 text-base"
              />
            </div>
            <button type="button" onClick={close} className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface-muted" aria-label="Close search">
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div id={listId} role="listbox" aria-label="Search results" className="mt-3 max-h-[min(24rem,60vh)] overflow-y-auto">
            {!query ? (
              <p className="px-3 py-5 text-sm leading-6 text-muted">Find a country guide or learn about a plug type.</p>
            ) : results.length ? (
              <ul className="grid gap-1">
                {results.map((result) => (
                  <li key={result.id} role="none">
                    <Link href={result.href} role="option" onClick={close} className="flex min-h-16 items-center gap-3 rounded-2xl px-3 py-2 hover:bg-brand-faint">
                      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${result.kind === "country" ? "text-2xl" : "bg-brand-soft font-bold text-brand-strong"}`} aria-hidden="true">{result.marker}</span>
                      <span className="min-w-0">
                        <span className="block font-bold text-foreground">{result.title}</span>
                        <span className="block truncate text-sm text-muted">{result.description}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-2xl bg-surface-muted px-4 py-5">
                <p className="font-semibold">No matching guide found</p>
                <p className="mt-1 text-sm text-muted">Try a country name, code, alias, or plug type such as “Type G”.</p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
