import { SearchIcon } from './icons';

interface SearchFieldProps {
  /** Unique id: the hero and the nav instance must not share one. */
  id: string;
  value: string;
  onChange: (value: string) => void;
  variant?: 'hero' | 'nav';
  className?: string;
}

/**
 * The single search control, reused by the hero and (once the hero scrolls
 * away) by the sticky nav. Both instances are driven by the same state.
 */
export function SearchField({
  id,
  value,
  onChange,
  variant = 'hero',
  className = '',
}: SearchFieldProps) {
  const isHero = variant === 'hero';

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Buscar sistemas de diseño
      </label>
      <SearchIcon
        className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted ${
          isHero ? 'size-5' : 'size-4'
        }`}
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={
          isHero
            ? 'Buscar por nombre, estilo, industria, tipografía…'
            : 'Buscar sistemas de diseño…'
        }
        autoComplete="off"
        className={
          isHero
            ? `h-14 w-full rounded-field border border-line bg-panel pl-12 pr-4 text-base text-ink
               placeholder:text-ink-muted transition-colors duration-200 focus:border-primary/60`
            : `h-11 w-full rounded-field border border-line bg-panel pl-10 pr-3 text-sm text-ink
               placeholder:text-ink-muted transition-colors duration-200 focus:border-primary/60`
        }
      />
    </div>
  );
}
