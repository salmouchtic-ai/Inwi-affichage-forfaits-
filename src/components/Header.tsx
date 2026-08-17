export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-extrabold tracking-tight text-inwi-600">inwi</span>
          <nav className="hidden items-center gap-6 text-sm font-medium text-ink-700 md:flex">
            <a className="transition-colors hover:text-inwi-600" href="#">
              Mobile
            </a>
            <a className="text-inwi-600" href="#">
              Forfaits
            </a>
            <a className="transition-colors hover:text-inwi-600" href="#">
              Internet
            </a>
            <a className="transition-colors hover:text-inwi-600" href="#">
              Roaming
            </a>
          </nav>
        </div>
        <button
          type="button"
          className="rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-900 transition-colors hover:border-inwi-600 hover:text-inwi-600"
        >
          Espace client
        </button>
      </div>
    </header>
  );
}
