import type { ColorFamily } from './color';

/** Theme facet values are stored raw ("light"/"dark"/"both") and labeled here. */
export const THEME_LABELS: Record<string, string> = {
  light: 'Claro',
  dark: 'Oscuro',
  both: 'Ambos',
};

export const DENSITY_LABELS: Record<string, string> = {
  compact: 'Compacta',
  comfortable: 'Cómoda',
  spacious: 'Amplia',
};

/** Shared vocabulary for businessTypes and industries (kebab-case tokens). */
export const BIZ_LABELS: Record<string, string> = {
  ai: 'IA',
  agency: 'Agencia',
  crypto: 'Cripto',
  design: 'Diseño',
  devtools: 'DevTools',
  ecommerce: 'E-commerce',
  education: 'Educación',
  fintech: 'Fintech',
  food: 'Gastronomía',
  gaming: 'Gaming',
  health: 'Salud',
  media: 'Media',
  other: 'Otro',
  productivity: 'Productividad',
  realestate: 'Inmobiliaria',
  saas: 'SaaS',
  travel: 'Viajes',
};

const SOURCE_LABELS: Record<string, string> = {
  'design.fish': 'Design.fish',
  'voltagent/awesome-design-md': 'awesome-design-md',
  'styles.refero.design': 'Refero',
  'designmd.app': 'designmd.app',
  webdesignhot: 'WebDesignHot',
  'shadcn.io': 'shadcn.io',
  'getmd.design': 'getmd.design',
};

export const FAMILY_LABELS: Record<ColorFamily, string> = {
  neutral: 'Neutro',
  red: 'Rojo',
  orange: 'Naranja',
  yellow: 'Amarillo',
  green: 'Verde',
  teal: 'Cian',
  blue: 'Azul',
  purple: 'Violeta',
  pink: 'Rosa',
};

export const BUCKET_LABELS: Record<string, string> = {
  '1-3': '1–3 colores',
  '4-6': '4–6 colores',
  '7-9': '7–9 colores',
  '10+': '10+ colores',
};

export type FacetId =
  | 'types'
  | 'styles'
  | 'themes'
  | 'sources'
  | 'industries'
  | 'fonts'
  | 'families'
  | 'densities'
  | 'buckets';

/** Human label for a facet value; unmapped identifiers (styles, fonts) stay as-is. */
export function facetLabel(facet: FacetId, value: string): string {
  switch (facet) {
    case 'themes':
      return THEME_LABELS[value] ?? value;
    case 'densities':
      return DENSITY_LABELS[value] ?? value;
    case 'types':
    case 'industries':
      return BIZ_LABELS[value] ?? value;
    case 'sources':
      return SOURCE_LABELS[value] ?? value;
    case 'families':
      return FAMILY_LABELS[value as ColorFamily] ?? value;
    case 'buckets':
      return BUCKET_LABELS[value] ?? value;
    case 'styles':
    case 'fonts':
      return value;
  }
}

/** Short badge label for the card overlay. */
export function sourceBadge(source: string): string {
  return SOURCE_LABELS[source] ?? source;
}
