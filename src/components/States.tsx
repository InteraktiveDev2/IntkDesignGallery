interface EmptyStateProps {
  onClearAll: () => void;
}

export function EmptyState({ onClearAll }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-card border border-line bg-card px-6 py-16 text-center">
      <h3 className="font-display text-xl font-semibold tracking-display text-ink">
        Sin resultados
      </h3>
      <p className="max-w-md text-sm text-ink-muted">
        Ningún sistema de diseño coincide con la combinación actual de búsqueda y filtros.
        Probá quitar algún filtro o cambiar los términos.
      </p>
      <button
        type="button"
        onClick={onClearAll}
        className="mt-2 min-h-11 rounded-button bg-primary px-8 text-sm font-semibold text-primary-ink
                   transition-colors duration-200 hover:bg-primary/80"
      >
        Limpiar filtros
      </button>
    </div>
  );
}

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-card border border-line bg-card px-6 py-16 text-center"
    >
      <h2 className="font-display text-2xl font-bold tracking-display text-ink">
        No se pudieron cargar los datos
      </h2>
      <p className="text-sm text-ink-muted">
        La galería no pudo leer <code className="text-ink-secondary">data/designs.json</code>.
        Verificá que el pipeline se haya ejecutado (<code className="text-ink-secondary">npm run data</code>)
        e intentá de nuevo.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 min-h-11 rounded-button bg-primary px-8 text-sm font-semibold text-primary-ink
                   transition-colors duration-200 hover:bg-primary/80"
      >
        Reintentar
      </button>
    </div>
  );
}
