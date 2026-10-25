#!/usr/bin/env node
/**
 * Data pipeline: JSONL -> slim public/data/designs.json
 *
 * Zero dependencies. Reads the canonical library export line-by-line,
 * maps each record to the trimmed shape the gallery consumes, drops
 * incomplete records, and writes a single JSON artifact loaded at runtime
 * via fetch (so the raw data never gets inlined into the JS bundle).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const inputPath = resolve(root, 'Data/design-md-library.jsonl');
const outDir = resolve(root, 'public/data');
const outPath = resolve(outDir, 'designs.json');

/** Split on a delimiter (string or RegExp), trim, drop empties, dedupe. */
function splitList(value, sep) {
  if (!value || typeof value !== 'string') return [];
  const seen = new Set();
  const out = [];
  for (const part of value.split(sep)) {
    const token = part.trim();
    if (token && !seen.has(token)) {
      seen.add(token);
      out.push(token);
    }
  }
  return out;
}

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/** Split colors_hex on whitespace, keep only valid #rgb/#rrggbb tokens. */
function parsePalette(value) {
  if (!value || typeof value !== 'string') return [];
  const seen = new Set();
  const out = [];
  for (const raw of value.split(/\s+/)) {
    const token = raw.trim();
    if (HEX_RE.test(token)) {
      const norm = token.toLowerCase();
      if (!seen.has(norm)) {
        seen.add(norm);
        out.push(norm);
      }
    }
  }
  return out;
}

/** Spacing density, guarded against malformed JSON. */
function parseDensity(value) {
  if (!value || typeof value !== 'string') return '';
  try {
    const parsed = JSON.parse(value);
    const density = parsed?.density;
    return typeof density === 'string' ? density.trim() : '';
  } catch {
    return '';
  }
}

/** theme "mixed" is normalized to "both" for the Claro/Oscuro/Ambos facet. */
function normalizeTheme(value) {
  const theme = (value ?? '').trim();
  return theme === 'mixed' ? 'both' : theme;
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

const raw = readFileSync(inputPath, 'utf8');
let lineNo = 0;
let parsed = 0;
let skippedNoId = 0;
let skippedNoName = 0;
let skippedNoImage = 0;

const designs = [];
for (const line of raw.split('\n')) {
  lineNo++;
  const trimmed = line.trim();
  if (!trimmed) continue;

  let rec;
  try {
    rec = JSON.parse(trimmed);
  } catch (err) {
    process.stderr.write(`WARN: line ${lineNo} is not valid JSON (${err.message})\n`);
    continue;
  }
  parsed++;

  const id = (rec.id ?? '').toString().trim();
  const name = (rec.name ?? '').toString().trim();
  const imageUrl = (rec.image_url ?? '').toString().trim();

  if (!id) { skippedNoId++; continue; }
  if (!name) { skippedNoName++; continue; }
  if (!imageUrl) { skippedNoImage++; continue; }

  const palette = parsePalette(rec.colors_hex);

  designs.push({
    id,
    name,
    slug: (rec.slug ?? '').toString().trim(),
    source: (rec.source ?? '').toString().trim(),
    sources: splitList(rec.sources, ','),
    url: (rec.url ?? '').toString().trim(),
    altUrls: (rec.alt_urls ?? '').toString().trim(),
    website: (rec.website ?? '').toString().trim(),
    imageUrl,
    imageHires: (rec.image_hires ?? '').toString().trim(),
    videoUrl: (rec.video_url ?? '').toString().trim(),
    category: (rec.category ?? '').toString().trim(),
    industry: (rec.industry ?? '').toString().trim(),
    // Source data delimits business_type with ";" despite the "," convention:
    // split on both so multi-value records aren't merged into one token.
    businessTypes: splitList(rec.business_type, /[,;]/),
    designType: (rec.design_type ?? '').toString().trim(),
    designStyles: splitList(rec.design_styles, ';'),
    theme: normalizeTheme(rec.theme),
    tags: splitList(rec.tags, ';'),
    fonts: splitList(rec.fonts, ';'),
    colorCount: palette.length || toNumber(rec.color_count),
    palette,
    primary: (rec.color_primary ?? '').toString().trim().toLowerCase(),
    density: parseDensity(rec.spacing_json),
    components: toNumber(rec.components_count),
    dos: toNumber(rec.dos_count),
    donts: toNumber(rec.donts_count),
    description: (rec.description ?? '').toString().trim(),
    hasMd: rec.has_design_md === 'yes',
  });
}

const payload = {
  generatedAt: new Date().toISOString(),
  count: designs.length,
  designs,
};

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, JSON.stringify(payload), 'utf8');

const size = Buffer.byteLength(JSON.stringify(payload), 'utf8');

process.stdout.write(
  [
    `Parsed lines:        ${parsed}`,
    `Skipped (no id):     ${skippedNoId}`,
    `Skipped (no name):   ${skippedNoName}`,
    `Skipped (no image):  ${skippedNoImage}`,
    `Emitted designs:     ${designs.length}`,
    `Output:              ${outPath}`,
    `Size:                ${(size / 1024 / 1024).toFixed(2)} MB`,
    `Generated at:        ${payload.generatedAt}`,
    '',
  ].join('\n'),
);
