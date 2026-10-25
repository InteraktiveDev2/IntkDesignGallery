---
version: alpha
name: "Interaktive Solutions"
website: "https://www.interaktivesolutions.com"
description: >
  Agencia argentina de soluciones tecnológicas con una identidad "violeta nocturno":
  un lienzo casi negro con tinte violeta (#0f0a19), superficies elevadas en ciruela
  oscuro (#1a1025) y un violeta orquídea (#7b5ea7) como única tensión de marca.
  La tipografía no usa pesos medios: alterna Inter para todo el cuerpo en 14–18px y
  Space Grotesk en todos los titulares y cifras grandes (hasta 72px, 700), con
  tracking cerrado (-0.02em). El color nunca se usa en superficies planas grandes:
  aparece como luz (halos radiales difuminados a 120px), como gradiente de texto
  teal→violeta en la palabra clave del hero y como texto con resplandor. El detalle
  firma es una retícula de 40×40px violeta al 7% sobre el hero, que convierte el
  fondo en un plano técnico. Sistema sin sombras: la profundidad viene de bordes de
  1px (#3a2d52), superficies escalonadas y blur de fondo.

colors:
  background: "#0f0a19"
  foreground: "#e8dff0"
  card: "#1a1025"
  card-foreground: "#e8dff0"
  primary: "#7b5ea7"
  primary-foreground: "#f0eaf5"
  secondary: "#2d2440"
  secondary-foreground: "#b8a0d2"
  muted: "#1e1630"
  muted-foreground: "#8a7a9e"
  accent: "#e8a0b0"
  accent-foreground: "#0f0a19"
  teal: "#1d928a"
  lavender: "#e2dfe5"
  soft-purple: "#624a89"
  destructive: "#e05577"
  border: "#3a2d52"
  input: "#2d2440"
  ring: "#7b5ea7"
  whatsapp: "#25D366"

typography:
  display:
    fontFamily: "'Space Grotesk', 'Inter', ui-sans-serif, system-ui, sans-serif"
    fontSize: 72px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  h1:
    fontFamily: "'Space Grotesk', 'Inter', sans-serif"
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  h2:
    fontFamily: "'Space Grotesk', 'Inter', sans-serif"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  h3:
    fontFamily: "'Space Grotesk', 'Inter', sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-lg:
    fontFamily: "'Inter', sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "'Inter', sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
  caption:
    fontFamily: "'Inter', sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
  overline:
    fontFamily: "'Inter', sans-serif"
    fontSize: 12px
    fontWeight: 500
    letterSpacing: "0.08em"
    textTransform: uppercase

rounded:
  sm: 8px
  md: 10px
  lg: 12px
  xl: 16px
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  section: 96px
  container: 1280px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    padding: "12px 32px"
    font: "{typography.label}"
    height: 48px
  button-primary-hover:
    backgroundColor: "color-mix(in oklab, {colors.primary} 80%, transparent)"
  button-secondary:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.lg}"
    padding: "12px 32px"
  nav:
    background: "rgba(15, 10, 25, 0.8)"
    blur: "24px"
    borderBottom: "1px solid {colors.border}"
    height: 76px
  card:
    backgroundColor: "{colors.card}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.xl}"
  badge:
    backgroundColor: "color-mix(in oklab, {colors.secondary} 50%, transparent)"
    textColor: "{colors.secondary-foreground}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.full}"
  project-card:
    backgroundColor: "{colors.card}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.xl}"
    imageOverlay: "linear-gradient(to top, {colors.background}80, transparent)"
  input:
    backgroundColor: "{colors.secondary}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.md}"
    focusRing: "{colors.ring}"
---

## Overview

Interaktive Solutions es un estudio de desarrollo web y automatización con base en Mar del Plata, Argentina. Su sitio es una landing de una sola página, en español, orientada a conversión por WhatsApp.

La identidad visual se puede resumir en una frase: **un laboratorio nocturno con luz violeta**. El fondo no es negro puro sino un violeta tinta (#0f0a19) que se lee como espacio profundo; las tarjetas suben un escalón a ciruela (#1a1025) y los bordes de 1px (#3a2d52) dibujan la estructura. No hay una sola sombra en todo el sitio: la profundidad se construye con capas de superficie, desenfoque y luz.

El sistema tiene tres gestos cromáticos muy deliberados:

1. **Violeta orquídea** (#7b5ea7) — el único color de acción. Botones primarios, anillo de foco, barra lateral del nav.
2. **Teal profundo** (#1d928a) — dato y acento. Aparece en cifras (+18 proyectos), en el halo del hero y como primer extremo del gradiente de texto.
3. **Rosa polvoriento** (#e8a0b0) — voz secundaria. Línea de acento de sección y tercer extremo de los gradientes.

El resultado es cálido y técnico a la vez: no se siente como un SaaS genérico oscuro porque el fondo tiene saturación violeta y la tipografía display es geométrica con tracking cerrado.

## Colors

### Superficies (jerarquía)
- **Background — #0f0a19**: lienzo de toda la página; violeta tinta casi negro.
- **Card — #1a1025**: tarjetas de servicio, proyectos, panel de contacto y sidebar.
- **Secondary — #2d2440**: campos de formulario, chips y hover de botones fantasma.
- **Muted — #1e1630**: bandas discretas dentro de tarjetas.

### Texto
- **Foreground — #e8dff0**: titulares y texto principal; blanco cálido con tinte lila, nunca #ffffff puro.
- **Secondary foreground — #b8a0d2**: subtítulos, ítems de lista y texto sobre `secondary`.
- **Muted foreground — #8a7a9e**: párrafos descriptivos, metadatos, copyright; contraste ~4.6:1 sobre el fondo.

### Marca y acento
- **Primary — #7b5ea7**: botones primarios, `--ring` de foco, punto activo del nav.
- **Accent — #e8a0b0**: rosa polvoriento; acentos y gradientes.
- **Teal — #1d928a**: cifras destacadas y halo secundario.
- **Lavender — #e2dfe5**: blanco lavanda para cifras del segundo bloque de métricas.
- **Soft purple — #624a89**: variante oscura del violeta para texto sobre superficies claras.

### Estado
- **Destructive — #e05577**: errores de formulario.
- **WhatsApp — #25D366**: verde de la marca de WhatsApp, único color ajeno a la paleta y solo para el ícono del CTA flotante.

## Typography

Dos familias, sin excepciones:

- **Space Grotesk** (300–700) — cargada como `--font-space-grotesk`. Se usa **solo** en el logotipo, en todos los H1–H3 y en las cifras grandes de métricas. Su carácter geométrico con terminaciones recortadas le da al sitio su tono "ingeniería".
- **Inter** (100–900) — `--font-body`/default. Todo el cuerpo, navegación, botones, formularios, etiquetas, metadatos.

La firma tipográfica es el contraste de escalas: titulares de 48–72px con `font-weight: 700` y `letter-spacing: -0.02em` convivien con cuerpo de 16px/400 y `line-height: 1.6`. No existen pesos intermedios por encima de 600 en el display: o es 400 para lectura o es 700 para impacto.

Escala real medida en producción: 72/700 (hero XL), 48/700 (hero desktop), 36/700 (H2 de sección), 20/600 (título de tarjeta), 18/600 y 18/400 (subtítulos y leads), 16/400 (cuerpo), 14/500 y 14/600 (botones y etiquetas), 12/400 y 12/500 (metadatos y overlines en mayúsculas con 0.08em de tracking).

## Layout

- Contenedor: `max-width: 1280px` con padding lateral de 24px.
- Hero a pantalla completa (`min-h-screen`) con el bloque de texto a la izquierda y una imagen de proyecto a la derecha en desktop; apilado en móvil.
- Secciones numeradas por eyebrow: `EXPLORAR`, `NUESTROS SERVICIOS`, `NUESTROS PROYECTOS`, `NUESTRO PROCESO`, `CONTACTO`; siempre 12px, mayúsculas, `letter-spacing: 0.08em`, color `secondary-foreground`.
- Ritmo vertical: 96px entre secciones en desktop, 64px en móvil; los títulos llevan 8–12px hasta el párrafo de apoyo y 32–40px hasta la grilla.
- Grillas: servicios 1 → 2 → 3 columnas (`gap: 24px`); proyectos 1 → 2 → 3 columnas con tarjetas 16:10; métricas 1 → 3 columnas centradas.
- Proceso: línea horizontal de 4 pasos con nodos numerados en desktop, vertical con línea a la izquierda en móvil.
- Formulario de contacto: dos columnas (nombre/email), luego servicio y mensaje a ancho completo.

## Depth & Elevation

No hay sombras (`box-shadow: none` en botones, tarjetas y nav). La elevación se expresa así:

- **Superficies escalonadas**: #0f0a19 → #1a1025 → #2d2440.
- **Bordes hairline** de 1px en #3a2d52 como separador de planos.
- **Glow** (clase `glow-purple`): `box-shadow: 0 0 40px #7b5ea74d, 0 0 80px #7b5ea71a` para destacar elementos flotantes sin simular sombra de objeto.
- **Halo radial**: círculos de 420–500px con `background: var(--primary)/10` o `teal/10` y `blur(120px)`, posicionados detrás del hero.
- **Backdrop blur** de 24px en el nav fijo sobre `rgba(15,10,25,0.8)`.

## Shapes

Radios medidos: 8px (chips pequeños e inputs compactos), 10px (inputs del formulario), 12px (botones — el más frecuente), 16px (tarjetas de servicio y proyecto), full/pill (badges, avatares, botón flotante de WhatsApp).

Regla: **nunca mezclar 8 y 16 en la misma familia de componente**. Botones siempre 12px; tarjetas siempre 16px; badges siempre pill.

## Backgrounds & Motion

- **Retícula técnica** (`.grid-bg`) en el hero: dos gradientes lineales cruzados de `#7b5ea712` con `background-size: 40px 40px`. Es el único patrón del sitio y solo aparece en la primera pantalla.
- **Gradiente de texto** (`.text-gradient-accent`): `linear-gradient(90deg, #1d928a, #7b5ea7)` recortado al texto; se usa exclusivamente en la última palabra del H1 ("tecnología").
- **Línea de acento de sección** (`.section-accent-line`): barra de 64×4px, pill, con `linear-gradient(90deg, #1d928a, #7b5ea7, #e8a0b0)`.
- **Glow de texto** (`.glow-text`): `text-shadow: 0 0 40px #7b5ea780` en H1 y cifras.
- **Transiciones**: 200–300ms, `ease`, sobre color de fondo, borde y `transform: scale(1.05–1.10)` en imágenes de tarjetas al hover. `scroll-behavior: smooth` global.

## Components

- **Nav fijo**: 76px de alto, fondo `rgba(15,10,25,0.8)`, blur 24px, borde inferior 1px `border`, logo 40px con radio 8px + wordmark Space Grotesk 18/600, enlaces 14px/400 en `muted-foreground` que pasan a `teal` en hover, CTA "Contáctanos" en violeta 12px de radio.
- **Botón primario**: violeta #7b5ea7, texto #f0eaf5, 14px/600, padding 14×32, radio 12px, hover `primary/80`, sin sombra.
- **Botón secundario**: transparente con borde 1px #3a2d52, texto 14/500, hover `bg-secondary`.
- **CTA WhatsApp**: píldora con el verde #25D366 solo en el icono, texto en `foreground`; enlace `wa.me` con mensaje prellenado por servicio.
- **Badge/eyebrow**: pill con `bg-secondary/50`, borde 1px, texto 12px/500 en mayúsculas con tracking amplio.
- **Tarjeta de servicio**: fondo `card`, borde 1px, radio 16px, icono de 40px en contenedor `primary/10`, título Space Grotesk 20/600, descripción 14–16px en `muted-foreground`, lista de 4 features con check en `teal`, CTA de texto "Consultar por WhatsApp" en violeta.
- **Tarjeta de proyecto**: imagen 16:10 con `object-cover`, overlay `linear-gradient(to top, #0f0a1980, transparent)`, chip de tipo ("Página Web", "E-Commerce", "API / Docs") en pill de `primary`, título 18–20/600, descripción, 2–3 tags y enlace "Ver detalles".
- **Bloque de métricas**: tres columnas centradas, cifra 48/700 Space Grotesk con glow (teal, lavender, accent), etiqueta 14px `muted-foreground`.
- **Stepper de proceso**: 4 pasos, círculo numerado 40px con borde violeta, título 18/600, descripción 14px; línea conectora en `border`.
- **Formulario**: labels 14/500, inputs con `bg-secondary`, borde 1px, radio 10px, foco con `ring` violeta de 2px y offset sobre el fondo; botón de envío a ancho completo.

## Do's and Don'ts

- **Do** mantener el violeta #7b5ea7 como único color de acción; un solo botón primario visible por bloque.
- **Do** usar el gradiente teal→violeta solo en palabras sueltas, nunca en párrafos completos.
- **Do** construir profundidad con superficies y bordes de 1px; no agregar sombras.
- **Do** reservar Space Grotesk para titulares y cifras; el cuerpo siempre Inter.
- **Do** usar mayúsculas con 0.08em de tracking solo en eyebrows de 12px.
- **Don't** usar #ffffff puro para texto: siempre #e8dff0 o #b8a0d2.
- **Don't** aplicar la retícula de 40px fuera del hero.
- **Don't** mezclar radios 8 y 16 dentro de la misma familia de componentes.
- **Don't** usar el verde #25D366 más allá del icono de WhatsApp.
- **Don't** superar 72px en titulares ni bajar el cuerpo de 14px.

## Responsive Behavior

- Breakpoints: móvil < 640px, tablet 640–1024px, desktop > 1024px.
- Hero: 2 columnas en desktop, apilado con texto centrado en móvil; H1 escala 36 → 48 → 60 → 72px.
- Nav: enlaces ocultos en móvil, menú hamburguesa; el CTA se mantiene visible.
- Grillas de 3 columnas pasan a 2 en tablet y 1 en móvil; gap 24 → 16px.
- Stepper de proceso rota de horizontal a vertical.
- Áreas táctiles mínimas de 44px; formulario a una columna.

## Agent Prompt Guide

**Referencia rápida de color**
- fondo: #0f0a19 · superficie: #1a1025 · superficie alternativa: #2d2440
- texto: #e8dff0 · texto secundario: #b8a0d2 · texto atenuado: #8a7a9e
- acción: #7b5ea7 (hover 80% de opacidad) · borde: #3a2d52
- acentos: teal #1d928a, rosa #e8a0b0, lavanda #e2dfe5

**Prompt de ejemplo**

> Crea una landing en React + Tailwind para una agencia de software. Fondo #0f0a19, tarjetas #1a1025 con borde 1px #3a2d52 y radio 16px. Titulares en Space Grotesk 700 con tracking -0.02em; cuerpo en Inter 16/400. Botón primario #7b5ea7, texto #f0eaf5, radio 12px, sin sombras. Hero a pantalla completa con retícula de 40px en #7b5ea712 y dos halos difuminados (blur 120px) en violeta y teal al 10%. La palabra final del titular lleva gradiente de texto teal→violeta. Eyebrows de sección en 12px mayúsculas con 0.08em de tracking en #b8a0d2.

<!-- Fuente: https://www.interaktivesolutions.com/ — tokens leídos del CSS compilado (:root) y del DOM renderizado el 2026-10-24. -->
