import { Compass } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-container flex min-h-[65vh] items-center justify-center py-16 text-center">
      <div className="max-w-xl rounded-[2rem] border bg-surface p-8 shadow-card sm:p-12">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong">
          <Compass className="size-7" aria-hidden="true" />
        </span>
        <p className="section-label mt-6">Guide not found</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">This route is not in our travel catalog.</h1>
        <p className="mt-4 leading-7 text-muted">The country, plug type, or comparison may be unavailable. Start again to choose a supported journey.</p>
        <Link href="/" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-2xl bg-brand px-5 font-bold text-white hover:bg-brand-strong">Return to TravelPlug</Link>
      </div>
    </section>
  );
}
