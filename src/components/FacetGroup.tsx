import { useMemo, useState } from 'react';
import type { FacetCount } from '../lib/filters';
import { normalizeText } from '../lib/text';
import { formatCount } from '../lib/format';
import { FAMILY_DOT, type ColorFamily } from '../lib/color';
import { facetLabel, type FacetId } from '../lib/labels';
import { CheckIcon, ChevronIcon } from './icons';

const COLLAPSED_LIMIT = 6;
const SEARCH_THRESHOLD = 20;

interface FacetGroupProps {
  facet: FacetId;
  label: string;
  counts: FacetCount[];
  selected: string[];
  onToggle: (value: string) => void;
  /** Render a color dot per option (families facet). */
  showDots?: boolean;
  /** Allow inline text filtering when the option list is long. */
  searchable?: boolean;
}

export function FacetGroup({
  facet,
  label,
  counts,
  selected,
  onToggle,
  showDots = false,
  searchable = false,
}: FacetGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState('');

  // Options with matches OR currently selected (selected stay visible even at 0).
  const visible = useMemo(
    () => counts.filter((c) => c.count > 0 || selected.includes(c.value)),
    [counts, selected],
  );

  const filtered = useMemo(() => {
    if (!text.trim()) return visible;
    const needle = normalizeText(text.trim());
    return visible.filter((c) => normalizeText(facetLabel(facet, c.value)).includes(needle));
  }, [visible, text, facet]);

  const shown = expanded ? filtered : filtered.slice(0, COLLAPSED_LIMIT);
  const canExpand = visible.length > COLLAPSED_LIMIT;
  const showSearch = searchable && expanded && visible.length > SEARCH_THRESHOLD;

  return (
    <section className="border-b border-line/60 py-4 last:border-b-0">
      <h3 className="eyebrow mb-2.5 text-ink-secondary">{label}</h3>

      {showSearch && (
        <label className="mb-2.5 block">
          <span className="sr-only">Filtrar {label}</span>
          <input
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Filtrar opciones…"
            className="w-full rounded-field border border-line bg-panel px-3 py-2 text-sm
                       text-ink placeholder:text-ink-muted focus:border-primary/60"
          />
        </label>
      )}

      <ul className="flex flex-col gap-0.5">
        {shown.map((option) => {
          const isSelected = selected.includes(option.value);
          const disabled = option.count === 0 && !isSelected;
          return (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => onToggle(option.value)}
                aria-pressed={isSelected}
                disabled={disabled}
                className="flex min-h-11 w-full items-center gap-2.5 rounded-button px-2 py-1.5 text-left
                           text-sm transition-colors duration-200 hover:bg-panel/60
                           disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span
                  className={`flex size-4 shrink-0 items-center justify-center rounded-[5px] border
                             ${isSelected ? 'border-primary bg-primary text-primary-ink' : 'border-line'}`}
                >
                  {isSelected && <CheckIcon className="size-3" strokeWidth={3} />}
                </span>

                {showDots && (
                  <span
                    className="size-3 shrink-0 rounded-full border border-line"
                    style={{ backgroundColor: FAMILY_DOT[option.value as ColorFamily] ?? 'transparent' }}
                    aria-hidden
                  />
                )}

                <span className={`min-w-0 flex-1 truncate ${isSelected ? 'text-ink' : 'text-ink-secondary'}`}>
                  {facetLabel(facet, option.value)}
                </span>

                <span className="shrink-0 tabular-nums text-xs text-ink-muted">
                  {formatCount(option.count)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {canExpand && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-primary
                     transition-colors duration-200 hover:text-ink-secondary"
        >
          {expanded ? 'Ver menos' : `Ver todos (${visible.length.toLocaleString('es')})`}
          <ChevronIcon className={`size-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
        </button>
      )}
    </section>
  );
}
