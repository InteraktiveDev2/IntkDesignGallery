import type { FilterState, ListFacet } from '../lib/filters';
import { facetLabel } from '../lib/labels';
import { CloseIcon } from './icons';

interface ActiveFilterChipsProps {
  state: FilterState;
  onRemoveValue: (facet: ListFacet, value: string) => void;
  onRemoveQuery: () => void;
  onRemoveMd: () => void;
  onRemoveWebsite: () => void;
  onClearAll: () => void;
}

/** Individual × chips for query, toggles and every selected facet value. */
export function ActiveFilterChips({
  state,
  onRemoveValue,
  onRemoveQuery,
  onRemoveMd,
  onRemoveWebsite,
  onClearAll,
}: ActiveFilterChipsProps) {
  const facets = Object.keys(state.facets) as ListFacet[];
  const hasAny =
    state.q.trim() !== '' || state.hasMd || state.hasWebsite ||
    facets.some((f) => state.facets[f].length > 0);

  if (!hasAny) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {state.q.trim() && (
        <Chip label={`Búsqueda: “${state.q.trim()}”`} onRemove={onRemoveQuery} />
      )}
      {state.hasMd && <Chip label="Con DESIGN.md" onRemove={onRemoveMd} />}
      {state.hasWebsite && <Chip label="Con sitio web" onRemove={onRemoveWebsite} />}

      {facets.flatMap((facet) =>
        state.facets[facet].map((value) => (
          <Chip
            key={`${facet}:${value}`}
            label={facetLabel(facet, value)}
            onRemove={() => onRemoveValue(facet, value)}
          />
        )),
      )}

      <button
        type="button"
        onClick={onClearAll}
        className="text-sm font-medium text-ink-muted underline-offset-4 transition-colors
                   duration-200 hover:text-accent hover:underline"
      >
        Limpiar todo
      </button>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel/50 py-1 pl-3 pr-1 text-xs font-medium text-ink-secondary">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Quitar filtro: ${label}`}
        className="flex size-6 items-center justify-center rounded-full text-ink-muted
                   transition-colors duration-200 hover:bg-primary/25 hover:text-ink"
      >
        <CloseIcon className="size-3.5" />
      </button>
    </span>
  );
}
