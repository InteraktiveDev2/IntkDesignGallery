import { useEffect, useRef } from 'react';
import type { FacetCounts, FilterState, ListFacet } from '../lib/filters';
import { CloseIcon } from './icons';
import { FilterPanel } from './FilterPanel';

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  state: FilterState;
  counts: FacetCounts;
  activeCount: number;
  onToggleFacet: (facet: ListFacet, value: string) => void;
  onToggleMd: (value: boolean) => void;
  onToggleWebsite: (value: boolean) => void;
  onClearAll: () => void;
}

/** Slide-over panel below lg: dialog semantics, focus trap, Escape/backdrop close. */
export function MobileFilterDrawer({
  open,
  onClose,
  state,
  counts,
  activeCount,
  onToggleFacet,
  onToggleMd,
  onToggleWebsite,
  onClearAll,
}: MobileFilterDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>('button')?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;

      const focusables = panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Cerrar filtros"
        onClick={onClose}
        className="absolute inset-0 bg-canvas/70 backdrop-blur-[2px]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filtros de la galería"
        className="animate-drawer-in absolute inset-y-0 left-0 flex w-[min(360px,92vw)] flex-col
                   border-r border-line bg-card"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-lg font-semibold tracking-display text-ink">
            Filtros{activeCount > 0 ? ` (${activeCount})` : ''}
          </h2>
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-sm text-ink-muted transition-colors duration-200 hover:text-accent"
              >
                Limpiar
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar filtros"
              className="flex size-11 items-center justify-center rounded-button border border-line
                         text-ink-secondary transition-colors duration-200 hover:bg-panel"
            >
              <CloseIcon className="size-5" />
            </button>
          </div>
        </div>

        <div className="scroll-slim min-h-0 flex-1 overflow-y-auto px-5 pb-8">
          <FilterPanel
            state={state}
            counts={counts}
            onToggleFacet={onToggleFacet}
            onToggleMd={onToggleMd}
            onToggleWebsite={onToggleWebsite}
          />
        </div>
      </div>
    </div>
  );
}
