/** Skeleton matching the real card anatomy (surfaces, no shadows). */
export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-card" aria-hidden>
      <div className="aspect-[16/10] animate-pulse bg-band" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-6 w-2/3 animate-pulse rounded-full bg-band" />
        <div className="h-4 w-full animate-pulse rounded-full bg-band" />
        <div className="h-4 w-4/5 animate-pulse rounded-full bg-band" />
        <div className="flex gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="size-5 animate-pulse rounded-full bg-band" />
          ))}
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-20 animate-pulse rounded-full bg-band" />
          <div className="h-6 w-24 animate-pulse rounded-full bg-band" />
        </div>
        <div className="mt-2 h-4 w-1/3 animate-pulse rounded-full bg-band" />
      </div>
    </div>
  );
}

export function SkeletonGrid() {
  return (
    <div
      className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
      role="status"
      aria-label="Cargando galería"
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
      <span className="sr-only">Cargando diseños…</span>
    </div>
  );
}
