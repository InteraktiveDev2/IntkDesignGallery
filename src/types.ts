/** Slim record shape produced by scripts/generate-data.mjs (public/data/designs.json). */
export interface Design {
  id: string;
  name: string;
  slug: string;
  source: string;
  sources: string[];
  url: string;
  altUrls: string;
  website: string;
  imageUrl: string;
  imageHires: string;
  videoUrl: string;
  category: string;
  industry: string;
  businessTypes: string[];
  designType: string;
  designStyles: string[];
  /** Normalized theme: "light" | "dark" | "both" ("" when unknown). */
  theme: string;
  tags: string[];
  fonts: string[];
  colorCount: number;
  /** Validated hex palette (#rgb / #rrggbb, lowercased). */
  palette: string[];
  primary: string;
  /** From spacing_json.density: "compact" | "comfortable" | "spacious" ("" when missing). */
  density: string;
  components: number;
  dos: number;
  donts: number;
  description: string;
  hasMd: boolean;
}

export interface DesignsPayload {
  generatedAt: string;
  count: number;
  designs: Design[];
}
