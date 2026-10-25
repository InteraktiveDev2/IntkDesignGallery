import { useCallback, useEffect, useRef, useState } from 'react';
import { SORT_OPTIONS, type FilterState, type SortKey } from '../lib/filters';
import { serializeHash } from '../lib/urlState';
import { resultsLabel } from '../lib/format';
import { COLUMN_OPTIONS, type ColumnsPerRow } from '../lib/view';
import { ColumnsIcon, LinkIcon } from './icons';

interface ResultsToolbarProps {
  /** Total records matching the current filters. */
  filteredTotal: number;
  /** Total records in the library. */
  grandTotal: number;
  isFiltered: boolean;
  state: FilterState;
  onSortChange: (sort: SortKey) => void;
  columns: ColumnsPerRow;
  onColumnsChange: (columns: ColumnsPerRow) => void;
}

export function ResultsToolbar({
  filteredTotal,
  grandTotal,
  isFiltered,
  state,
  onSortChange,
  columns,
  onColumnsChange,
}: ResultsToolbarProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const copyLink = useCallback(async () => {
    const { origin, pathname, search } = window.location;
    const url = `${origin}${pathname}${search}${serializeHash(state)}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Non-secure-context fallback: temporary textarea.
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 2000);
  }, [state]);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
      <p
        className="min-w-0 flex-1 text-sm font-medium text-ink-secondary"
        aria-live="polite"
        aria-atomic="true"
      >
        {resultsLabel(filteredTotal, grandTotal, isFiltered)}
      </p>

      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
        <label className="flex min-w-0 items-center gap-2">
          {/* Visible label only when there is room; stays accessible on small screens. */}
          <span className="sr-only text-sm text-ink-muted sm:not-sr-only">Ordenar</span>
          <select
            value={state.sort}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="max-w-full min-h-11 rounded-field border border-line bg-panel px-3 py-2 text-sm
                       text-ink transition-colors duration-200 hover:border-primary/50"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <div
          role="group"
          aria-label="Vista de la grilla"
          className="hidden min-h-11 items-center gap-1 rounded-button border border-line bg-panel/40 p-1 sm:flex"
        >
          {COLUMN_OPTIONS.map((count) => {
            const active = columns === count;
            return (
              <button
                key={count}
                type="button"
                onClick={() => onColumnsChange(count)}
                aria-pressed={active}
                aria-label={`${count} por fila`}
                title={`${count} por fila`}
                className={`inline-flex size-9 items-center justify-center rounded-[8px]
                            transition-colors duration-200 ${
                              active
                                ? 'bg-primary/25 text-ink'
                                : 'text-ink-muted hover:bg-panel hover:text-ink'
                            }`}
              >
                <ColumnsIcon count={count} className="size-4" />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={copyLink}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-button border border-line bg-transparent
                     px-4 text-sm font-medium text-ink transition-colors duration-200 hover:bg-panel"
        >
          <LinkIcon className="size-4 text-teal" />
          {copied ? '¡Enlace copiado!' : 'Copiar enlace'}
        </button>
      </div>
    </div>
  );
}
