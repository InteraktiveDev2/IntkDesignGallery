import type { FacetCounts, ListFacet } from '../lib/filters';
import type { FilterState } from '../lib/filters';
import { FacetGroup } from './FacetGroup';

const FACET_META: readonly { id: ListFacet; label: string; dots?: boolean; searchable?: boolean }[] = [
  { id: 'types', label: 'Tipos de negocio' },
  { id: 'styles', label: 'Estilos de diseño' },
  { id: 'themes', label: 'Tema' },
  { id: 'sources', label: 'Origen del registro' },
  { id: 'industries', label: 'Industrias', searchable: true },
  { id: 'fonts', label: 'Tipografías', searchable: true },
  { id: 'families', label: 'Familia de color', dots: true },
  { id: 'densities', label: 'Densidad' },
  { id: 'buckets', label: 'Tamaño de paleta' },
];

interface FilterPanelProps {
  state: FilterState;
  counts: FacetCounts;
  onToggleFacet: (facet: ListFacet, value: string) => void;
  onToggleMd: (value: boolean) => void;
  onToggleWebsite: (value: boolean) => void;
}

/** Shared by the desktop sticky rail and the mobile slide-over. */
export function FilterPanel({
  state,
  counts,
  onToggleFacet,
  onToggleMd,
  onToggleWebsite,
}: FilterPanelProps) {
  return (
    <div>
      <div className="flex flex-col gap-1 border-b border-line/60 pb-4">
        <ToggleRow
          label="Solo con DESIGN.md"
          pressed={state.hasMd}
          onChange={onToggleMd}
        />
        <ToggleRow
          label="Solo con sitio web"
          pressed={state.hasWebsite}
          onChange={onToggleWebsite}
        />
      </div>

      {FACET_META.map((meta) => (
        <FacetGroup
          key={meta.id}
          facet={meta.id}
          label={meta.label}
          counts={counts[meta.id]}
          selected={state.facets[meta.id]}
          onToggle={(value) => onToggleFacet(meta.id, value)}
          showDots={meta.dots}
          searchable={meta.searchable}
        />
      ))}
    </div>
  );
}

function ToggleRow({
  label,
  pressed,
  onChange,
}: {
  label: string;
  pressed: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={pressed}
      onClick={() => onChange(!pressed)}
      className="flex min-h-11 items-center justify-between gap-3 rounded-button px-2 py-1.5 text-left
                 text-sm transition-colors duration-200 hover:bg-panel/60"
    >
      <span className={pressed ? 'text-ink' : 'text-ink-secondary'}>{label}</span>
      <span
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-200
                   ${pressed ? 'border-primary bg-primary/40' : 'border-line bg-panel'}`}
      >
        <span
          className={`inline-block size-4 rounded-full transition-transform duration-200
                     ${pressed ? 'translate-x-[22px] bg-primary' : 'translate-x-[3px] bg-ink-muted'}`}
        />
      </span>
    </button>
  );
}
