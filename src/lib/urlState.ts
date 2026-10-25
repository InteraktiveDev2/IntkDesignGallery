import {
  defaultFilterState,
  LIST_FACETS,
  SORT_OPTIONS,
  type FilterState,
  type ListFacet,
  type SortKey,
} from './filters';

const SORT_KEYS: readonly string[] = SORT_OPTIONS.map((o) => o.value);

/** Singular / legacy spellings accepted on parse (e.g. `#theme=dark`). */
const FACET_ALIASES: Record<string, ListFacet> = {
  type: 'types',
  style: 'styles',
  theme: 'themes',
  source: 'sources',
  industry: 'industries',
  font: 'fonts',
  family: 'families',
  density: 'densities',
  bucket: 'buckets',
  color: 'buckets',
  colors: 'buckets',
};

/** Parse a location.hash (with or without "#") into filter state. Unknown keys are ignored. */
export function parseHash(hash: string): FilterState {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const state = defaultFilterState();

  state.q = params.get('q') ?? '';

  const sort = params.get('sort');
  if (sort && SORT_KEYS.includes(sort)) state.sort = sort as SortKey;

  state.hasMd = params.get('md') === '1';
  state.hasWebsite = params.get('site') === '1';

  for (const facet of LIST_FACETS) {
    const values = params.getAll(facet);
    if (values.length > 0) state.facets[facet] = dedupe(values.map(trimmed).filter(Boolean));
  }
  for (const [alias, facet] of Object.entries(FACET_ALIASES)) {
    const values = params.getAll(alias).map(trimmed).filter(Boolean);
    if (values.length === 0) continue;
    state.facets[facet] = dedupe([...state.facets[facet], ...values]);
  }

  return state;
}

/** Serialize filter state to a hash string ("#..." or "" when empty). */
export function serializeHash(state: FilterState): string {
  const params = new URLSearchParams();

  if (state.q.trim()) params.set('q', state.q.trim());
  if (state.sort !== 'name-asc') params.set('sort', state.sort);
  if (state.hasMd) params.set('md', '1');
  if (state.hasWebsite) params.set('site', '1');

  for (const facet of LIST_FACETS) {
    for (const value of state.facets[facet]) params.append(facet, value);
  }

  const qs = params.toString();
  return qs ? `#${qs}` : '';
}

function trimmed(value: string): string {
  return value.trim();
}

function dedupe(values: string[]): string[] {
  return [...new Set(values)];
}
