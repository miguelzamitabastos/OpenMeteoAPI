import Link from 'next/link'
import { ThemeToggle } from '@/app/components/ThemeToggle'

export function SiteHeader(): JSX.Element {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-8">
        <Link href="/" className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-slate-100">
          Weather Portal
        </Link>
        <nav className="flex items-center gap-2" aria-label="Primary navigation">
          <Link
            href="/"
            className="rounded-full px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Today
          </Link>
          <Link
            href="/forecast"
            className="rounded-full px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Forecast
          </Link>
          <Link
            href="/alerts"
            className="rounded-full px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Alerts
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}