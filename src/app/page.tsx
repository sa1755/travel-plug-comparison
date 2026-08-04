import { CircleCheck, Gauge, PlaneTakeoff, PlugZap, ShieldCheck } from "lucide-react";

const benefits = [
  {
    icon: PlugZap,
    step: "01",
    title: "Check the connection",
    description: "See whether your plug fits before an adapter reaches your packing list.",
  },
  {
    icon: Gauge,
    step: "02",
    title: "Understand the power",
    description: "Make sense of voltage and frequency differences in plain language.",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "Pack with confidence",
    description: "Know which everyday devices should work and which need a closer check.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border/70 bg-surface">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_18%,rgba(26,115,232,0.12),transparent_32%),radial-gradient(circle_at_9%_88%,rgba(232,240,254,0.8),transparent_28%)]"
        />
        <div className="page-container grid gap-14 py-20 sm:py-28 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-20 lg:py-32">
          <div className="max-w-3xl">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/15 bg-brand-faint px-3.5 py-1.5 text-sm font-semibold text-brand-strong">
              <PlaneTakeoff className="size-4" aria-hidden="true" />
              Clear answers for every journey
            </p>
            <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-[4.5rem]">
              Know what plug you need before you fly.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted sm:text-xl sm:leading-9">
              Compare sockets, voltage and device compatibility between countries.
              Get one clear answer, without the electrical jargon.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-muted">
              <span className="inline-flex items-center gap-2">
                <CircleCheck className="size-4.5 text-brand" aria-hidden="true" />
                Simple recommendations
              </span>
              <span className="inline-flex items-center gap-2">
                <CircleCheck className="size-4.5 text-brand" aria-hidden="true" />
                Built for mobile travel
              </span>
            </div>
          </div>

          <aside
            aria-labelledby="journey-card-title"
            className="rounded-[1.75rem] border border-border/80 bg-surface p-2 shadow-elevated"
          >
            <div className="rounded-[1.35rem] bg-brand px-6 py-6 text-white sm:px-7">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/75">
                Your travel power guide
              </p>
              <h2 id="journey-card-title" className="mt-2 text-2xl font-bold tracking-tight">
                From itinerary to answer.
              </h2>
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand-strong">
                  1
                </span>
                <div>
                  <p className="font-semibold text-foreground">Start with home</p>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    Tell us where your plugs and devices come from.
                  </p>
                </div>
              </div>
              <div className="ml-[1.1rem] h-6 border-l border-dashed border-border-strong" aria-hidden="true" />
              <div className="flex gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand-strong">
                  2
                </span>
                <div>
                  <p className="font-semibold text-foreground">Add your destination</p>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    We bring the important compatibility details together.
                  </p>
                </div>
              </div>
            </div>
            <div className="mx-5 mb-5 flex items-center justify-between gap-4 rounded-2xl bg-surface-muted px-4 py-3.5 sm:mx-6 sm:mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                  The result
                </p>
                <p className="mt-1 font-bold text-foreground">One clear recommendation</p>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-strong">
                <CircleCheck className="size-5" aria-hidden="true" />
              </span>
            </div>
          </aside>
        </div>
      </section>

      <section
        id="how-it-works"
        aria-labelledby="foundation-benefits"
        className="page-container scroll-mt-24 py-16 sm:py-24"
      >
        <div className="max-w-3xl">
          <p className="section-label">How TravelPlug helps</p>
          <h2
            id="foundation-benefits"
            className="mt-3 text-balance text-3xl font-bold tracking-[-0.03em] sm:text-4xl sm:leading-tight"
          >
            Everything important. Nothing overwhelming.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
            TravelPlug turns technical power information into the practical choices
            you need to make before departure.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {benefits.map(({ icon: Icon, step, title, description }) => (
            <article
              key={title}
              className="rounded-3xl border border-border/90 bg-surface p-6 sm:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-bold text-muted">{step}</span>
              </div>
              <h3 className="mt-6 text-lg font-bold tracking-tight">{title}</h3>
              <p className="mt-2 leading-7 text-muted">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border/70 bg-surface-muted">
        <div className="page-container py-14 sm:py-16">
          <div className="flex flex-col gap-5 rounded-3xl border border-brand/10 bg-surface px-6 py-7 shadow-card sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="max-w-2xl">
              <p className="section-label">Designed for clarity</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Technical detail when you need it. A simple answer when you do not.
              </h2>
            </div>
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong">
              <ShieldCheck className="size-6" aria-hidden="true" />
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
