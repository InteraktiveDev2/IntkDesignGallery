/** Deterministic es-style grouping (2.612) — Intl grouping data varies by runtime. */
export function formatCount(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** "2.612 diseños" when unfiltered, "N de 2.612" when a filter is active. */
export function resultsLabel(shown: number, total: number, filtered: boolean): string {
  return filtered
    ? `${formatCount(shown)} de ${formatCount(total)}`
    : `${formatCount(total)} diseños`;
}
