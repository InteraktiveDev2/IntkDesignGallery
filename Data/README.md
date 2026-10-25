# DESIGN.md Library — dataset para tu base de datos

Catálogo propio de sistemas de diseño en formato `DESIGN.md`, listo para cargar en una base de datos y usar como herramienta interna (búsqueda por estilo, por industria, por color, etc.).

## Qué contiene

- **2.612 fichas únicas** (después de deduplicar por dominio entre 7 galerías). Las galerías originales suman 4.498 registros; un mismo sitio aparecía en varias.
- Todas las fichas tienen **imagen** (URL directa) y **link a la ficha original**.
- **1.110 fichas** traen además el **DESIGN.md completo** descargado (carpeta `designs/`), no solo la ficha.
- Colores: paleta completa en hex por ficha (`colors_hex`), colores con nombre y rol (`colors_json`), color primario.
- Tipografías, estilos de diseño clasificados, tipo de negocio, tema claro/oscuro, tags, espaciado, nº de componentes y descripción.

## Archivos

| Archivo | Para qué |
|---|---|
| `design-md-library.db` | SQLite listo para usar. Tabla `designs` + índice de búsqueda de texto `designs_fts` (FTS5). |
| `design-md-library.csv` | Import universal (Excel, Sheets, Airtable, Supabase, Notion, Postgres `COPY`). UTF-8. |
| `design-md-library.jsonl` | 1 registro por línea, ideal para MongoDB, Elasticsearch o ingestión por API. |
| `catalogo-design-md.md` | Catálogo navegable con imágenes y paletas, agrupado por estilo y por tipo de negocio. |
| `designs/*.md` | Los `DESIGN.md` completos (2.203 archivos; algunas fichas comparten archivo porque son la misma marca en varias galerías; otras fuentes no los publican). |

## Esquema (`designs`)

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | TEXT PK | `dmd_00001`… |
| `name` | TEXT | Nombre de la marca o del estilo |
| `slug` | TEXT | slug del origen |
| `source` | TEXT | Galería principal (la de mayor calidad cuando hay duplicado) |
| `sources` | TEXT | Todas las galerías donde aparece, separadas por coma |
| `url` | TEXT | Link a la ficha original (el que pediste) |
| `alt_urls` | TEXT | Fichas de las otras galerías que lo contienen (`;`) |
| `website` | TEXT | Web real de la marca (1.943 fichas; el resto son estilos genéricos sin web) |
| `image_url` | TEXT | Imagen de la tarjeta (preview). Todas las fichas la tienen |
| `image_hires` | TEXT | Versión grande / detalle cuando existe |
| `video_url` | TEXT | Video de preview (design.fish, Refero) cuando existe |
| `category` | TEXT | Categoría de la galería original |
| `industry` | TEXT | Industria declarada por la galería |
| `business_type` | TEXT | Clasificación propia, hasta 3: `fintech, crypto, ecommerce, ai, devtools, saas, agency, media, travel, health, education, automotive, gaming, realestate, food` |
| `design_type` | TEXT | "North star" / categoría estética original |
| `design_styles` | TEXT | Clasificación propia: `minimal-swiss, editorial, dark-cinematic, gradient-mesh, glassmorphism, brutalist, neubrutalism, retro-vintage, playful-colorful, luxury-premium, technical-terminal, organic-soft` |
| `theme` | TEXT | `light` / `dark` |
| `tags` | TEXT | Tags originales (`;`) |
| `fonts` | TEXT | Familias tipográficas (`;`) |
| `color_count` | INT | Nº de colores únicos |
| `color_primary` | TEXT | Color primario en hex |
| `colors_hex` | TEXT | Paleta completa en hex separada por espacios |
| `colors_json` | JSON | Lista `{name, hex, group, role}` |
| `spacing_json` | JSON | Radios, gaps, max-width, densidad |
| `components_count`, `dos_count`, `donts_count` | INT | Reglas y componentes documentados |
| `description` | TEXT | Descripción del sistema (hasta 2.000 caracteres) |
| `has_design_md` | TEXT | `yes`/`no` |
| `design_md_file` | TEXT | Nombre del archivo en `designs/` |
| `design_md_bytes` | INT | Tamaño del `.md` |

## Ejemplos de consulta

```sql
-- Fichas fintech con paleta oscura
SELECT name, url, color_primary, design_styles
FROM designs
WHERE business_type LIKE '%fintech%' AND theme = 'dark'
ORDER BY color_count DESC;

-- Búsqueda de texto completo
SELECT name, url FROM designs_fts WHERE designs_fts MATCH 'glassmorphism fintech' LIMIT 20;

-- Agrupar por estilo de diseño
SELECT design_styles, COUNT(*) FROM designs GROUP BY design_styles ORDER BY 2 DESC;
```

Python:

```python
import sqlite3
con = sqlite3.connect("design-md-library.db")
con.row_factory = sqlite3.Row
for r in con.execute("SELECT * FROM designs WHERE image_url != '' LIMIT 5"):
    print(r["name"], r["image_url"], r["colors_hex"][:60])
```

Nota: no abras el `.db` directamente desde una carpeta de red (SQLite bloquea); cópialo a local primero si tu herramienta se queja.

## Fuentes y cobertura

| Galería | Registros | Con imagen | Con DESIGN.md completo |
|---|---|---|---|
| design.fish | 1.266 | sí | no (ficha JSON con tokens) |
| styles.refero.design | 1.342 | sí | no (datos estructurados) |
| designmd.app | 759 | sí | sí |
| shadcn.io | 500 | sí | sí |
| webdesignhot | 473 | sí (OG generado) | no |
| VoltAgent/awesome-design-md | 84 | preview HTML | sí |
| getmd.design | 74 | sí | sí |
| md-design.io | 7 ejemplos | — | no incluido (muy pocos, duplicados de Google Labs) |

Los archivos son interpretaciones extraídas de webs públicas (no guías de marca oficiales), salvo los ejemplos de Google Labs (Apache-2.0). Revisa licencias antes de uso comercial masivo.
