export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-6 py-10 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          Interaktive Design Gallery — catálogo abierto de sistemas de diseño. Los datos se
          generan desde <code className="text-ink-secondary">Data/design-md-library.jsonl</code>.
        </p>
        <a
          href="https://www.interaktivesolutions.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink-secondary transition-colors duration-200 hover:text-teal"
        >
          Interaktive Solutions
        </a>
      </div>
    </footer>
  );
}
