function SkelBar({ width }: { width: string }) {
  return (
    <div
      className="h-2.5 animate-pulse rounded bg-surface-raised"
      style={{ width }}
    />
  );
}

export default function Loading() {
  const rows = [62, 70, 50, 64];

  return (
    <section className="px-4 py-7 sm:px-8 sm:py-8">
      <div className="grid gap-3">
        <SkelBar width="120px" />
        <SkelBar width="180px" />
      </div>

      <div className="mt-8 hidden grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-surface lg:grid">
        {rows.map((w, i) => (
          <div
            key={i}
            className="flex items-center gap-6 border-b border-border/60 px-5 py-5 last:border-0"
          >
            <div className="flex-1">
              <SkelBar width={`${w}%`} />
            </div>
            <SkelBar width="80px" />
            <SkelBar width="100px" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 lg:hidden">
        {rows.slice(0, 3).map((w, i) => (
          <div
            key={i}
            className="grid gap-3 rounded-2xl border border-border bg-surface p-4"
          >
            <SkelBar width={`${w}%`} />
            <SkelBar width="40%" />
          </div>
        ))}
      </div>
    </section>
  );
}
