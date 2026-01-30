import Link from "next/link";
import { AuthButton } from "./AuthButton";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex w-full items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold text-slate-900 dark:text-white">
          BookSphere
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link className="nav-link" href="/about">About</Link>
          <Link className="nav-link" href="/events">Events</Link>
          <Link className="nav-link" href="/artists">Artists</Link>
          <Link className="nav-link" href="/sports">Sports</Link>
          <Link className="nav-link" href="/music">Music</Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}

