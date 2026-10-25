/** Accent- and case-insensitive normalization: NFD, strip diacritics, lowercase. */
export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

/** Split a query into non-empty normalized tokens. */
export function tokenizeQuery(query: string): string[] {
  return query
    .split(/\s+/)
    .filter(Boolean)
    .map(normalizeText);
}
