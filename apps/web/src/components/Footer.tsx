export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-4 px-6 py-10 text-sm text-slate-500 dark:text-slate-400 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="text-base font-semibold text-slate-900 dark:text-white">BookSphere</div>
          <p>Discover concerts, sports, and premieres with instant booking and QR tickets.</p>
          <p>Powered by Contentstack · Built for Gen‑Z discovery.</p>
        </div>
        <div className="grid gap-2 md:grid-cols-2 md:gap-x-8">
          <a className="nav-link" href="/about">About</a>
          <a className="nav-link" href="/events">Events</a>
          <a className="nav-link" href="/artists">Artists</a>
          <a className="nav-link" href="/sports">Sports</a>
          <a className="nav-link" href="/music">Music</a>
          <a className="nav-link" href="/#recommended">Recommendations</a>
        </div>
      </div>
    </footer>
  );
}

