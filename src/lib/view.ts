/** Grid density preference (cards per row on wide screens). Persisted locally. */
export type ColumnsPerRow = 1 | 2 | 3;

export const COLUMN_OPTIONS: readonly ColumnsPerRow[] = [1, 2, 3];

export const DEFAULT_COLUMNS: ColumnsPerRow = 2;

const STORAGE_KEY = 'intk-gallery:columns';

export function readColumns(): ColumnsPerRow {
  try {
    const stored = Number(window.localStorage.getItem(STORAGE_KEY));
    if (stored === 1 || stored === 2 || stored === 3) return stored;
  } catch {
    // Private mode / storage disabled: fall back to the default.
  }
  return DEFAULT_COLUMNS;
}

export function writeColumns(value: ColumnsPerRow): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // Non-fatal: the preference just won't survive a reload.
  }
}

/** Tailwind classes for the results grid. Mobile always stays at one column. */
export function columnsGridClass(value: ColumnsPerRow): string {
  switch (value) {
    case 1:
      return 'grid-cols-1';
    case 3:
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    case 2:
    default:
      return 'grid-cols-1 sm:grid-cols-2';
  }
}
