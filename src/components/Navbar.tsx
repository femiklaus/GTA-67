export function Navbar() {
  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 -rotate-6 items-center justify-center rounded-lg bg-lemon">
            <span className="font-display text-sm font-bold text-ink">S</span>
          </div>
          <div>
            <p className="font-display text-lg font-semibold leading-none text-ink">
              Sentinel
            </p>
            <p className="text-[11px] leading-none text-ash">
              on Midnight
            </p>
          </div>
        </div>

        <span className="hidden rounded-full border border-line px-3 py-1 text-xs font-medium text-ink-soft sm:inline-block">
          Preview Testnet
        </span>
      </div>
    </header>
  );
}
