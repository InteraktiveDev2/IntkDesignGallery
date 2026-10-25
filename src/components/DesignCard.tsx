import { memo, type ReactNode } from 'react';
import type { IndexedDesign } from '../lib/filters';
import { facetLabel, sourceBadge, THEME_LABELS } from '../lib/labels';
import { ExternalIcon, FileTextIcon } from './icons';

const MAX_SWATCHES = 6;
const MAX_TYPES = 2;
const MAX_STYLES = 2;

function themeLabel(theme: string): string {
  return THEME_LABELS[theme] ?? facetLabel('themes', theme);
}

interface Chip {
  key: string;
  label: string;
}

/** Up to 2 business types + 2 design styles; overflow collapses into "+N". */
function buildChips(d: IndexedDesign): { chips: Chip[]; extra: number } {
  const types = d.businessTypes.slice(0, MAX_TYPES);
  const styles = d.designStyles.slice(0, MAX_STYLES);
  const chips = [
    ...types.map((v) => ({ key: `t:${v}`, label: facetLabel('types', v) })),
    ...styles.map((v) => ({ key: `s:${v}`, label: v })),
  ];
  const extra =
    d.businessTypes.length - types.length + (d.designStyles.length - styles.length);
  return { chips, extra };
}

interface DesignCardProps {
  design: IndexedDesign;
}

export const DesignCard = memo(function DesignCard({ design: d }: DesignCardProps) {
  const { chips, extra } = buildChips(d);
  const swatches = d.palette.slice(0, MAX_SWATCHES);
  const extraSwatches = d.palette.length - swatches.length;
  const primaryFont = d.fonts[0] ?? '';
  const showTheme = d.theme ? themeLabel(d.theme) : '';
  const showSource = d.source ? sourceBadge(d.source) : '';

  return (
    <a
      href={d.link || undefined}
      target="_blank"
      rel="noopener noreferrer"
      referrerPolicy="no-referrer"
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-card
                 transition-colors duration-200 hover:border-primary/60 focus-visible:border-primary/60"
      aria-label={`${d.name} — abrir ficha original en una pestaña nueva`}
    >
      {/* Media */}
      <div className="relative aspect-[16/10] overflow-hidden bg-band">
        <img
          src={d.imageUrl}
          alt={`${d.name} — ${d.designType || 'sistema de diseño'}`}
          loading="lazy"
          decoding="async"
          className="card-media h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(to top, #0f0a1980, transparent)' }}
        />

        {d.hasMd && (
          <span
            title="La ficha original incluye el DESIGN.md completo"
            className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border
                       border-teal/40 bg-canvas/70 px-2.5 py-0.5 text-[11px] font-medium text-teal
                       backdrop-blur-sm"
          >
            <FileTextIcon className="size-3.5" />
            DESIGN.md
          </span>
        )}

        {/* Overlay badges */}
        {(showTheme || showSource) && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {showTheme && <OverlayBadge>{showTheme}</OverlayBadge>}
            {showSource && <OverlayBadge>{showSource}</OverlayBadge>}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3.5 p-6 sm:p-7">
        <h3 className="truncate font-display text-[22px] font-semibold leading-tight tracking-display text-ink sm:text-2xl">
          {d.name}
        </h3>

        {d.description && (
          <p className="line-clamp-2 text-[15px] leading-[1.55] text-ink-muted">{d.description}</p>
        )}

        {/* Palette */}
        {swatches.length > 0 && (
          <div className="flex items-center gap-1.5">
            {swatches.map((hex) => (
              <span
                key={hex}
                title={hex}
                className="size-6 rounded-full border border-line"
                style={{ backgroundColor: hex }}
              />
            ))}
            {extraSwatches > 0 && (
              <span className="text-[11px] font-medium text-ink-muted">+{extraSwatches}</span>
            )}
          </div>
        )}

        {/* Chips */}
        {(chips.length > 0 || extra > 0) && (
          <div className="flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <span
                key={chip.key}
                className="rounded-full border border-line bg-panel/50 px-3 py-1 text-[13px] font-medium text-ink-secondary"
              >
                {chip.label}
              </span>
            ))}
            {extra > 0 && (
              <span className="rounded-full border border-line px-3 py-1 text-[13px] font-medium text-ink-muted">
                +{extra}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          {primaryFont ? (
            <span className="truncate text-[13px] text-ink-muted">{primaryFont}</span>
          ) : (
            <span />
          )}
          <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-medium text-teal">
            Ver ficha
            <ExternalIcon className="size-3.5" />
          </span>
        </div>
      </div>
    </a>
  );
});

function OverlayBadge({ children }: { children: ReactNode }) {
  return (
    <span
      className="rounded-full border border-line bg-canvas/70 px-2.5 py-0.5 text-[11px] font-medium
                 text-ink-secondary backdrop-blur-sm"
    >
      {children}
    </span>
  );
}
