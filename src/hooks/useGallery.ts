import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
  applyFilters,
  defaultFilterState,
  type FacetCounts,
  isDefaultState,
  LIST_FACETS,
  PAGE_SIZE,
  sortResults,
  type FilterState,
  type IndexedDesign,
  type ListFacet,
  type SortKey,
} from '../lib/filters';
import { tokenizeQuery } from '../lib/text';
import { parseHash, serializeHash } from '../lib/urlState';

export interface Gallery {
  state: FilterState;
  counts: FacetCounts;
  results: IndexedDesign[];
  visible: IndexedDesign[];
  shownCount: number;
  totalCount: number;
  /** Total records in the library (pre-filter). */
  grandTotal: number;
  hasMore: boolean;
  isFiltered: boolean;
  activeFilterCount: number;
  setQuery: (q: string) => void;
  setSort: (sort: SortKey) => void;
  toggleFacetValue: (facet: ListFacet, value: string) => void;
  setFacet: (facet: ListFacet, values: string[]) => void;
  setHasMd: (v: boolean) => void;
  setHasWebsite: (v: boolean) => void;
  clearAll: () => void;
  loadMore: () => void;
}

/**
 * Owns the full filter model: state + URL sync + cross-filtered results +
 * pagination. Normalization is memoized upstream (indexDesigns); here we
 * recompute only when the deferred query or selections actually change.
 */
export function useGallery(items: readonly IndexedDesign[]): Gallery {
  const [state, setState] = useState<FilterState>(() => parseHash(window.location.hash));
  const [page, setPage] = useState(1);

  // Debounced query for heavy recompute; keeps typing responsive.
  const deferredQ = useDeferredValue(state.q);

  const tokens = useMemo(() => tokenizeQuery(deferredQ), [deferredQ]);

  const { results, counts } = useMemo(
    // state.q is intentionally absent from deps: queries flow through `tokens`
    // (deferred). The facets object keeps its identity across query keystrokes.
    () => applyFilters(items, tokens, state),
    [items, tokens, state.facets, state.hasMd, state.hasWebsite],
  );

  const sorted = useMemo(() => sortResults(results, state.sort), [results, state.sort]);

  const visible = useMemo(
    () => sorted.slice(0, page * PAGE_SIZE),
    [sorted, page],
  );

  const activeFilterCount = useMemo(
    () =>
      LIST_FACETS.reduce((sum, f) => sum + state.facets[f].length, 0) +
      (state.q.trim() ? 1 : 0) +
      (state.hasMd ? 1 : 0) +
      (state.hasWebsite ? 1 : 0),
    [state.facets, state.q, state.hasMd, state.hasWebsite],
  );

  const isFiltered = !isDefaultState(state);

  // Reset pagination whenever the filter result set changes.
  useEffect(() => {
    setPage(1);
  }, [deferredQ, state.facets, state.hasMd, state.hasWebsite]);

  // Sync filter state to location.hash (debounced for typing).
  useEffect(() => {
    const hash = serializeHash(state);
    const id = window.setTimeout(() => {
      const target = hash || window.location.pathname + window.location.search;
      if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== target) {
        window.history.replaceState(null, '', target);
      }
    }, 250);
    return () => window.clearTimeout(id);
  }, [state]);

  // React to manual hash edits / external navigation. Our own replaceState
  // writes never fire hashchange, so this cannot loop.
  useEffect(() => {
    const onHashChange = () => setState(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const setQuery = useCallback((q: string) => setState((s) => ({ ...s, q })), []);
  const setSort = useCallback((sort: SortKey) => setState((s) => ({ ...s, sort })), []);

  const setFacet = useCallback((facet: ListFacet, values: string[]) => {
    setState((s) => ({ ...s, facets: { ...s.facets, [facet]: values } }));
  }, []);

  const toggleFacetValue = useCallback((facet: ListFacet, value: string) => {
    setState((s) => {
      const current = s.facets[facet];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...s, facets: { ...s.facets, [facet]: next } };
    });
  }, []);

  const setHasMd = useCallback(
    (v: boolean) => setState((s) => ({ ...s, hasMd: v })),
    [],
  );
  const setHasWebsite = useCallback(
    (v: boolean) => setState((s) => ({ ...s, hasWebsite: v })),
    [],
  );

  const clearAll = useCallback(() => setState(defaultFilterState()), []);
  const loadMore = useCallback(() => setPage((p) => p + 1), []);

  return {
    state,
    counts,
    results,
    visible,
    shownCount: visible.length,
    totalCount: sorted.length,
    grandTotal: items.length,
    hasMore: visible.length < sorted.length,
    isFiltered,
    activeFilterCount,
    setQuery,
    setSort,
    toggleFacetValue,
    setFacet,
    setHasMd,
    setHasWebsite,
    clearAll,
    loadMore,
  };
}
