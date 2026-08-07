export default function Loading() {
  return (
    <div className="page-container py-16" role="status" aria-live="polite">
      <span className="sr-only">Loading travel guide</span>
      <div className="animate-pulse rounded-[2rem] border bg-surface p-8 motion-reduce:animate-none">
        <div className="h-3 w-32 rounded-full bg-brand-soft" />
        <div className="mt-6 h-10 max-w-xl rounded-2xl bg-surface-muted" />
        <div className="mt-4 h-5 max-w-2xl rounded-xl bg-surface-muted" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="h-52 rounded-3xl bg-surface-muted" />
          <div className="h-52 rounded-3xl bg-surface-muted" />
        </div>
      </div>
    </div>
  );
}
