import type { Design } from '../types';
import { dominantColorFamily, type ColorFamily } from './color';
import { normalizeText } from './text';

/** Page size for the "Cargar más" pagination. */
export const PAGE_SIZE = 48;

/** Design + values derived once after fetch (never recomputed per render). */
export interface IndexedDesign extends Design {
  /** Normalized concatenation of every searchable field. */
  haystack: string;
  /** Palette-derived color family used by the "families" facet. */
  colorFamily: ColorFamily;
  /** Resolved destination for the card link (url -> alt url -> website). */
  link: string;
}

export type SortKey = 'name-asc' | 'colors-desc' | 'rules-desc' | 'name-desc';

export const SORT_OPTIONS: readonly { value: SortKey; label: string }[] = [
  { value: 'name-asc', label: 'Nombre A–Z' },
  { value: 'colors-desc', label: 'Más colores' },
  { value: 'rules-desc', label: 'Más reglas documentadas' },
  { value: 'name-desc', label: 'Nombre Z–A' },
];

/** Multi-select list facets. OR within a facet, AND across facets. */
export const LIST_FACETS = [
  'types',
  'styles',
  'themes',
  'sources',
  'industries',
  'fonts',
  'families',
  'densities',
  'buckets',
] as const;

export type ListFacet = (typeof LIST_FACETS)[number];

export interface FilterState {
  q: string;
  sort: SortKey;
  hasMd: boolean;
  hasWebsite: boolean;
  facets: Record<ListFacet, string[]>;
}

export function defaultFilterState(): FilterState {
  return {
    q: '',
    sort: 'name-asc',
    hasMd: false,
    hasWebsite: false,
    facets: {
      types: [],
      styles: [],
      themes: [],
      sources: [],
      industries: [],
      fonts: [],
      families: [],
      densities: [],
      buckets: [],
    },
  };
}

export function isDefaultState(s: FilterState): boolean {
  return (
    !s.q &&
    !s.hasMd &&
    !s.hasWebsite &&
    LIST_FACETS.every((f) => s.facets[f].length === 0)
  );
}

function firstAltUrl(altUrls: string): string {
  const first = altUrls.split(',')[0]?.trim();
  return first ?? '';
}

/** Build the per-record search index and derived facet values, once. */
export function indexDesigns(designs: readonly Design[]): IndexedDesign[] {
  return designs.map((d) => {
    const haystack = normalizeText(
      [
        d.name,
        d.description,
        d.tags.join(' '),
        d.fonts.join(' '),
        d.industry,
        d.category,
        d.designType,
        d.designStyles.join(' '),
        d.businessTypes.join(' '),
        d.source,
        d.website,
      ].join(' \u0000 '),
    );
    const link = d.url || firstAltUrl(d.altUrls) || d.website;
    return { ...d, haystack, colorFamily: dominantColorFamily(d.palette), link };
  });
}

/** Every value a record contributes to the given facet. */
export function facetValues(d: IndexedDesign, facet: ListFacet): readonly string[] {
  switch (facet) {
    case 'types':
      return d.businessTypes;
    case 'styles':
      return d.designStyles;
    case 'themes':
      return d.theme ? [d.theme] : [];
    case 'sources':
      return d.sources.length > 0 ? d.sources : d.source ? [d.source] : [];
    case 'industries':
      return d.industry ? [d.industry] : [];
    case 'fonts':
      return d.fonts;
    case 'families':
      return [d.colorFamily];
    case 'densities':
      return d.density ? [d.density] : [];
    case 'buckets':
      return paletteBucket(d.colorCount) ? [paletteBucket(d.colorCount)] : [];
  }
}

/** Palette-size band for the "buckets" facet; empty string when unclassified. */
export function paletteBucket(colorCount: number): string {
  if (colorCount <= 0) return '';
  if (colorCount <= 3) return '1-3';
  if (colorCount <= 6) return '4-6';
  if (colorCount <= 9) return '7-9';
  return '10+';
}

function intersects(values: readonly string[], selected: ReadonlySet<string>): boolean {
  for (const v of values) {
    if (selected.has(v)) return true;
  }
  return false;
}

export interface FacetCount {
  value: string;
  count: number;
}

/** Per-facet option lists, cross-filtered. */
export type FacetCounts = Record<ListFacet, FacetCount[]>;

interface ActiveConstraint {
  facet: ListFacet;
  selected: ReadonlySet<string>;
}

function passes(
  d: IndexedDesign,
  active: readonly ActiveConstraint[],
  state: FilterState,
  except: ListFacet | null,
): boolean {
  for (const c of active) {
    if (c.facet === except) continue;
    if (!intersects(facetValues(d, c.facet), c.selected)) return false;
  }
  if (state.hasMd && !d.hasMd) return false;
  if (state.hasWebsite && !d.website) return false;
  return true;
}

/**
 * Compute cross-filtered counts and the final result set.
 * Count semantics for facet F: among records matching q + every OTHER
 * facet's selection + toggles, how many offer each value of F.
 * Sort of options: count desc, tie label asc; selected values are kept even at 0.
 */
export function applyFilters(
  items: readonly IndexedDesign[],
  tokens: readonly string[],
  state: FilterState,
): { results: IndexedDesign[]; counts: FacetCounts } {
  const active: ActiveConstraint[] = [];
  for (const facet of LIST_FACETS) {
    const selected = state.facets[facet];
    if (selected.length > 0) active.push({ facet, selected: new Set(selected) });
  }

  // Search pass (independent of facets).
  const searchPass = items.map((d) => matchesSearch(d, tokens));

  const results: IndexedDesign[] = [];
  for (let i = 0; i < items.length; i++) {
    const d = items[i]!;
    if (!searchPass[i]) continue;
    if (!passes(d, active, state, null)) continue;
    results.push(d);
  }

  const buckets = new Map<ListFacet, Map<string, number>>();
  for (const facet of LIST_FACETS) buckets.set(facet, new Map());

  const anyConstraint = active.length > 0 || state.hasMd || state.hasWebsite;

  if (!anyConstraint) {
    // Nothing selected anywhere: single pass fills every facet.
    for (let i = 0; i < items.length; i++) {
      const d = items[i]!;
      if (!searchPass[i]) continue;
      for (const facet of LIST_FACETS) {
        const map = buckets.get(facet)!;
        for (const v of facetValues(d, facet)) {
          map.set(v, (map.get(v) ?? 0) + 1);
        }
      }
    }
  } else {
    // Cross-filter: for each facet, count values among records that pass
    // search + every OTHER facet + toggles.
    for (const target of LIST_FACETS) {
      const map = buckets.get(target)!;
      for (let i = 0; i < items.length; i++) {
        const d = items[i]!;
        if (!searchPass[i]) continue;
        if (!passes(d, active, state, target)) continue;
        for (const v of facetValues(d, target)) {
          map.set(v, (map.get(v) ?? 0) + 1);
        }
      }
    }
  }

  const facets = {} as FacetCounts;
  for (const facet of LIST_FACETS) {
    const selected = state.facets[facet];
    const map = buckets.get(facet)!;
    for (const value of selected) if (!map.has(value)) map.set(value, 0);
    facets[facet] = [...map.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value, 'es'));
  }

  return { results, counts: facets };
}

function matchesSearch(d: IndexedDesign, tokens: readonly string[]): boolean {
  for (const t of tokens) {
    if (!tokenMatches(d.haystack, t)) return false;
  }
  return true;
}

/**
 * Token match with a light Spanish/English suffix relaxation for recall:
 * "violeta" also matches "violet", "negra" matches "negro". The corpus is
 * documented in English while the UI (and users) are Spanish-speaking.
 * AND semantics across tokens are preserved.
 */
function tokenMatches(haystack: string, token: string): boolean {
  if (haystack.includes(token)) return true;
  if (token.length >= 5) {
    const last = token[token.length - 1];
    if (last === 'a' || last === 'e' || last === 'o') {
      if (haystack.includes(token.slice(0, -1))) return true;
    }
  }
  return false;
}

/** Sort per the toolbar options. Default and ties fall back to name A–Z ('es' locale). */
export function sortResults(items: IndexedDesign[], sort: SortKey): IndexedDesign[] {
  const byName = (a: IndexedDesign, b: IndexedDesign) =>
    a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });

  const sorted = [...items];
  switch (sort) {
    case 'name-asc':
      sorted.sort(byName);
      break;
    case 'name-desc':
      sorted.sort((a, b) => -byName(a, b));
      break;
    case 'colors-desc':
      sorted.sort((a, b) => b.colorCount - a.colorCount || byName(a, b));
      break;
    case 'rules-desc':
      sorted.sort(
        (a, b) => b.dos + b.donts - (a.dos + a.donts) || byName(a, b),
      );
      break;
  }
  return sorted;
}
