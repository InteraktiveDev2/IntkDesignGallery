import { useEffect, useState } from 'react';
import type { Gallery as GalleryModel } from '../hooks/useGallery';
import { formatCount } from '../lib/format';
import { FilterPanel } from './FilterPanel';
import { ActiveFilterChips } from './ActiveFilterChips';
import { ResultsToolbar } from './ResultsToolbar';
import { DesignCard } from './DesignCard';
import { EmptyState } from './States';
import { MobileFilterDrawer } from './MobileFilterDrawer';
import { FilterIcon } from './icons';
import {
  columnsGridClass,
  readColumns,
  writeColumns,
  type ColumnsPerRow,
} from '../lib/view';

interface GalleryProps {
  gallery: GalleryModel;
}

export function Gallery({ gallery }: GalleryProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [columns, setColumns] = useState<ColumnsPerRow>(readColumns);

  useEffect(() => {
    writeColumns(columns);
  }, [columns]);

  return (
    <>
      <section
        id="resultados"
        aria-label="Explorar diseños"
        className="mx-auto max-w-[1280px] px-6 pb-24 pt-8 lg:pb-32 lg:pt-10"
      >
        <div className="flex gap-10">
          {/* Desktop sticky rail */}
          <aside className="hidden w-[290px] shrink-0 lg:block">
            <div className="scroll-slim sticky top-[100px] max-h-[calc(100vh-124px)] overflow-y-auto rounded-card border border-line bg-card px-5 pb-4 pt-5">
              <h2 className="font-display text-lg font-semibold tracking-display text-ink">Filtros</h2>
              <div
                className="mt-2 h-1 w-16 rounded-full"
                style={{ background: 'linear-gradient(90deg, #1d928a, #7b5ea7, #e8a0b0)' }}
                aria-hidden
              />
              <FilterPanel
                state={gallery.state}
                counts={gallery.counts}
                onToggleFacet={gallery.toggleFacetValue}
                onToggleMd={gallery.setHasMd}
                onToggleWebsite={gallery.setHasWebsite}
              />
            </div>
          </aside>

          {/* Results */}
          <div className="min-w-0 flex-1">
            <ResultsToolbar
              filteredTotal={gallery.totalCount}
              grandTotal={gallery.grandTotal}
              isFiltered={gallery.isFiltered}
              state={gallery.state}
              onSortChange={gallery.setSort}
              columns={columns}
              onColumnsChange={setColumns}
            />

            <div className="mt-4">
              <ActiveFilterChips
                state={gallery.state}
                onRemoveValue={(facet, value) => {
                  gallery.setFacet(
                    facet,
                    gallery.state.facets[facet].filter((v) => v !== value),
                  );
                }}
                onRemoveQuery={() => gallery.setQuery('')}
                onRemoveMd={() => gallery.setHasMd(false)}
                onRemoveWebsite={() => gallery.setHasWebsite(false)}
                onClearAll={gallery.clearAll}
              />
            </div>

            {gallery.visible.length > 0 ? (
              <div
                className={`grid gap-6 pt-8 sm:gap-7 ${columnsGridClass(columns)}`}
              >
                {gallery.visible.map((d) => (
                  <DesignCard key={d.id} design={d} />
                ))}
              </div>
            ) : (
              <div className="pt-6">
                <EmptyState onClearAll={gallery.clearAll} />
              </div>
            )}

            {gallery.hasMore && (
              <div className="mt-10 flex flex-col items-center gap-3">
                <p className="text-sm text-ink-muted">
                  Mostrando {formatCount(gallery.shownCount)} de {formatCount(gallery.totalCount)}
                </p>
                <button
                  type="button"
                  onClick={gallery.loadMore}
                  className="min-h-11 rounded-button border border-line bg-transparent px-8 text-sm
                             font-medium text-ink transition-colors duration-200 hover:bg-panel"
                >
                  Cargar más
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile trigger */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={drawerOpen}
        className="fixed bottom-5 left-5 z-40 inline-flex min-h-11 items-center gap-2 rounded-full
                   bg-primary px-5 text-sm font-semibold text-primary-ink transition-colors
                   duration-200 hover:bg-primary/80 lg:hidden"
      >
        <FilterIcon className="size-4" />
        Filtros{gallery.activeFilterCount > 0 ? ` (${gallery.activeFilterCount})` : ''}
      </button>

      <MobileFilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        state={gallery.state}
        counts={gallery.counts}
        activeCount={gallery.activeFilterCount}
        onToggleFacet={gallery.toggleFacetValue}
        onToggleMd={gallery.setHasMd}
        onToggleWebsite={gallery.setHasWebsite}
        onClearAll={gallery.clearAll}
      />
    </>
  );
}
