import { SearchField } from './SearchField';

interface HeaderProps {
  resultsLabel: string;
  query: string;
  onQueryChange: (q: string) => void;
  /** True once the hero search has scrolled out of view. */
  showSearch: boolean;
}

export function Header({ resultsLabel, query, onQueryChange, showSearch }: HeaderProps) {
  const logoUrl = `${import.meta.env.BASE_URL}logo.png`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 backdrop-blur-[24px]">
      <div className="mx-auto flex h-[76px] max-w-[1280px] items-center gap-4 px-6">
        <a
          href="#"
          onClick={(event) => {
            // Browsers would treat "#" as a hash change and wipe the filter
            // state — scroll to top without touching location.hash.
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex min-w-0 shrink-0 items-center gap-3 rounded-button"
          aria-label="Interaktive Design Gallery — volver arriba"
        >
          <img
            src={logoUrl}
            alt=""
            width={40}
            height={40}
            className="size-10 shrink-0 object-contain"
          />
          <span
            className={`font-display text-lg font-semibold tracking-display text-ink ${
              showSearch ? 'hidden sm:inline' : ''
            }`}
          >
            Interaktive
          </span>
          <span className="hidden h-4 w-px bg-line sm:block" aria-hidden />
          <span className="hidden truncate text-sm text-ink-muted sm:block">Design Gallery</span>
        </a>

        {showSearch && (
          <div className="min-w-0 flex-1">
            <SearchField
              id="nav-search"
              variant="nav"
              value={query}
              onChange={onQueryChange}
              className="mx-auto w-full max-w-md"
            />
          </div>
        )}

        <div className="ml-auto flex shrink-0 items-center gap-5">
          <p
            className={`text-sm tabular-nums text-ink-secondary ${
              showSearch ? 'hidden lg:block' : ''
            }`}
            aria-live="polite"
          >
            {resultsLabel}
          </p>
          <a
            href="https://www.interaktivesolutions.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm text-ink-muted transition-colors duration-200 hover:text-teal md:inline"
          >
            interaktivesolutions.com
          </a>
        </div>
      </div>
    </header>
  );
}
