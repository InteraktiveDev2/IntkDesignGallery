import { useEffect, useRef, type RefObject } from 'react';
import { SearchField } from './SearchField';

/**
 * The hero leaves 3.5x faster than the page scrolls: the band collapses and
 * its content drifts up together, so the results arrive early instead of
 * leaving a blank screen behind.
 */
const SCROLL_SPEED = 3.5;

interface HeroProps {
  query: string;
  onQueryChange: (q: string) => void;
  /** Observed by App to decide when the search moves into the sticky nav. */
  searchRef: RefObject<HTMLDivElement | null>;
}

export function Hero({ query, onQueryChange, searchRef }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    // Reduced motion (or no rAF): keep the static, full-height hero.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let fullHeight = 0;
    let frame = 0;

    const paint = () => {
      frame = 0;
      const travelled = Math.min(fullHeight, Math.max(0, window.scrollY) * SCROLL_SPEED);
      section.style.height = `${fullHeight - travelled}px`;
      stage.style.transform = `translate3d(0, ${-(travelled * (SCROLL_SPEED - 1)) / SCROLL_SPEED}px, 0)`;
      stage.style.opacity = `${Math.max(0, 1 - travelled / fullHeight)}`;
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const measure = () => {
      section.style.height = '';
      stage.style.height = '';
      stage.style.transform = '';
      stage.style.opacity = '';
      fullHeight = section.getBoundingClientRect().height;
      stage.style.height = `${fullHeight}px`;
      paint();
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[calc(100svh-76px)] overflow-hidden [overflow-anchor:none]"
      aria-labelledby="hero-title"
    >
      {/* Technical grid — allowed here ONLY */}
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
      {/* Radial halo — behind the hero only */}
      <div
        className="animate-halo-drift pointer-events-none absolute -top-32 left-1/2 size-[560px]
                   rounded-full bg-primary/10 blur-[130px]"
        aria-hidden
      />

      <div
        ref={stageRef}
        className="absolute inset-x-0 top-0 flex h-[calc(100svh-76px)] flex-col items-center
                   justify-center gap-9 px-6 will-change-transform"
      >
        <h1
          id="hero-title"
          className="animate-hero-float max-w-4xl text-center font-display text-5xl font-bold
                     leading-[1.02] tracking-display sm:text-6xl lg:text-7xl xl:text-[84px]"
        >
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(90deg, #1d928a, #7b5ea7, #e8a0b0)' }}
          >
            Interaktive Design.md Gallery
          </span>
        </h1>

        <div ref={searchRef} className="w-full max-w-[720px]">
          <SearchField
            id="hero-search"
            variant="hero"
            value={query}
            onChange={onQueryChange}
          />
        </div>
      </div>
    </section>
  );
}
