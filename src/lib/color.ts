export type ColorFamily =
  | 'neutral'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'blue'
  | 'purple'
  | 'pink';

export const COLOR_FAMILIES: readonly ColorFamily[] = [
  'neutral',
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'purple',
  'pink',
] as const;

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{3,8})$/i.exec(hex.trim());
  if (!m) return null;
  const digits = m[1] ?? '';
  if (digits.length === 3 || digits.length === 4) {
    const r = parseInt(digits[0]!.repeat(2), 16);
    const g = parseInt(digits[1]!.repeat(2), 16);
    const b = parseInt(digits[2]!.repeat(2), 16);
    return [r, g, b];
  }
  if (digits.length === 6 || digits.length === 8) {
    const r = parseInt(digits.slice(0, 2), 16);
    const g = parseInt(digits.slice(2, 4), 16);
    const b = parseInt(digits.slice(4, 6), 16);
    return [r, g, b];
  }
  return null;
}

/** Returns [h 0..360, s 0..1, l 0..1]. */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === rn) {
    h = (gn - bn) / d + (gn < bn ? 6 : 0);
  } else if (max === gn) {
    h = (bn - rn) / d + 2;
  } else {
    h = (rn - gn) / d + 4;
  }
  return [h * 60, s, l];
}

function hueToBucket(h: number): ColorFamily {
  if (h < 15 || h >= 345) return 'red';
  if (h < 45) return 'orange';
  if (h < 70) return 'yellow';
  if (h < 160) return 'green';
  if (h < 200) return 'teal';
  if (h < 255) return 'blue';
  if (h < 290) return 'purple';
  return 'pink';
}

/**
 * Representative swatch per family: brand-anchored where the palette has
 * one (neutral/teal/purple/pink), harmonious muted tones otherwise.
 */
export const FAMILY_DOT: Record<ColorFamily, string> = {
  neutral: '#8a7a9e',
  red: '#d4574e',
  orange: '#dd8a3d',
  yellow: '#d9bd4f',
  green: '#5fae62',
  teal: '#1d928a',
  blue: '#5b7fd4',
  purple: '#7b5ea7',
  pink: '#e8a0b0',
};

/**
 * Bucket a palette into one color family: the most chromatic color
 * (highest saturation), excluding near-black / near-white / near-gray.
 * Falls back to "neutral" when nothing chromatic remains.
 */
export function dominantColorFamily(palette: readonly string[]): ColorFamily {
  let bestSat = -1;
  let bestHue = -1;

  for (const hex of palette) {
    const rgb = hexToRgb(hex);
    if (!rgb) continue;
    const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
    if (l < 0.12 || l > 0.92) continue; // near-black / near-white
    if (s < 0.15) continue; // near-gray
    if (s > bestSat) {
      bestSat = s;
      bestHue = h;
    }
  }

  if (bestHue < 0) return 'neutral';
  return hueToBucket(bestHue);
}
