import { ArrowRight, CircleCheck, Gauge, PlugZap } from "lucide-react";

const benefits = [
  {
    icon: PlugZap,
    title: "The right adapter",
    description: "See whether your plugs fit the sockets at your destination.",
  },
  {
    icon: Gauge,
    title: "Clear power guidance",
    description: "Understand voltage and frequency differences without the jargon.",
  },
  {
    icon: CircleCheck,
    title: "Device-specific advice",
    description: "Know which essentials can travel safely and which need extra care.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b bg-surface">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(circle_at_75%_20%,rgba(23,107,77,0.14),transparent_42%)]"
        />
        <div className="page-container grid gap-12 py-20 sm:py-28 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-36">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border bg-brand-soft px-3 py-1 text-sm font-semibold text-brand-strong">
              <span className="size-2 rounded-full bg-brand" aria-hidden="true" />
              Travel power, explained simply
            </p>
            <h1 className="text-balance text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
              Know what plug you need before you fly.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted sm:text-xl">
              Compare sockets, voltage and device compatibility between countries,
              then pack with confidence.
            </p>
          </div>

          <div className="rounded-3xl border bg-background p-5 shadow-card sm:p-7">
            <div className="flex items-center justify-between gap-4 border-b pb-5">
              <div>
                <p className="text-sm font-semibold text-brand">Your journey</p>
                <p className="mt-1 text-xl font-bold">One clear recommendation</p>
              </div>
              <ArrowRight className="size-6 text-brand" aria-hidden="true" />
            </div>
            <p className="pt-5 leading-7 text-muted">
              Choose where you are travelling from and where you are going. TravelPlug
              will bring every compatibility detail together in one useful guide.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="foundation-benefits" className="page-container py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">
            Built for real journeys
          </p>
          <h2
            id="foundation-benefits"
            className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Everything important, nothing overwhelming.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {benefits.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-2xl border bg-surface p-6 shadow-card">
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand-strong">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-2 leading-7 text-muted">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
