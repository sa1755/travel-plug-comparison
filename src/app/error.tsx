"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { trackEvent } from "@/lib/analytics";

interface ErrorPageProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
    trackEvent("error_encountered", { error_type: "application_render_failed" });
  }, []);

  return (
    <section className="page-container flex min-h-[65vh] items-center justify-center py-16 text-center" aria-labelledby="application-error-title">
      <div className="max-w-xl rounded-[2rem] border bg-surface p-8 shadow-card sm:p-12">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-danger-soft text-danger">
          <TriangleAlert className="size-7" aria-hidden="true" />
        </span>
        <p className="section-label mt-6">Something went wrong</p>
        <h1 ref={headingRef} tabIndex={-1} id="application-error-title" className="mt-2 text-3xl font-bold tracking-tight outline-none sm:text-4xl">This travel guide could not be displayed.</h1>
        <p className="mt-4 leading-7 text-muted" role="alert">Try loading this view again. If the problem continues, return home and start a new comparison.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand px-5 font-bold text-white hover:bg-brand-strong">
            <RotateCcw className="size-4" aria-hidden="true" /> Try again
          </button>
          <Link href="/" className="inline-flex min-h-12 items-center rounded-2xl border border-border-strong bg-surface px-5 font-bold text-brand-strong">Return home</Link>
        </div>
      </div>
    </section>
  );
}
