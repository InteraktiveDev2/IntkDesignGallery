import { useEffect, useRef, useState } from 'react';
import { fetchDesigns } from './lib/api';
import { indexDesigns, type IndexedDesign } from './lib/filters';
import { useGallery } from './hooks/useGallery';
import { resultsLabel } from './lib/format';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Gallery } from './components/Gallery';
import { Footer } from './components/Footer';
import { SkeletonGrid } from './components/SkeletonCard';
import { ErrorState } from './components/States';

const EMPTY: readonly IndexedDesign[] = [];

type LoadState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; designs: IndexedDesign[] };

export default function App() {
  const [load, setLoad] = useState<LoadState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoad({ status: 'loading' });
    fetchDesigns(attempt)
      .then((payload) => {
        if (!cancelled) {
          setLoad({ status: 'ready', designs: indexDesigns(payload.designs) });
        }
      })
      .catch(() => {
        if (!cancelled) setLoad({ status: 'error' });
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const items = load.status === 'ready' ? load.designs : EMPTY;
  const gallery = useGallery(items);
  const ready = load.status === 'ready';

  // The search lives in the hero until it scrolls under the sticky header,
  // then reappears inside the nav (same state, two instances).
  const heroSearchRef = useRef<HTMLDivElement | null>(null);
  const [navSearchVisible, setNavSearchVisible] = useState(false);

  useEffect(() => {
    const target = heroSearchRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setNavSearchVisible(!entry.isIntersecting);
      },
      { rootMargin: '-76px 0px 0px 0px', threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const headerLabel = ready
    ? resultsLabel(gallery.totalCount, items.length, gallery.isFiltered)
    : 'Cargando…';

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <a
        href="#resultados"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50
                   focus:rounded-button focus:bg-primary focus:px-4 focus:py-2 focus:text-sm
                   focus:font-semibold focus:text-primary-ink"
      >
        Saltar a los resultados
      </a>

      <Header
        resultsLabel={headerLabel}
        query={gallery.state.q}
        onQueryChange={gallery.setQuery}
        showSearch={navSearchVisible}
      />

      <main>
        <Hero
          query={gallery.state.q}
          onQueryChange={gallery.setQuery}
          searchRef={heroSearchRef}
        />

        {load.status === 'loading' && (
          <div className="mx-auto max-w-[1280px] px-6">
            <SkeletonGrid />
          </div>
        )}

        {load.status === 'error' && (
          <div className="mx-auto max-w-[1280px] px-6 py-16">
            <ErrorState onRetry={() => setAttempt((a) => a + 1)} />
          </div>
        )}

        {ready && <Gallery gallery={gallery} />}
      </main>

      <Footer />
    </div>
  );
}
