export function ForecastSkeleton(): JSX.Element {
  return (
    <div
      className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
      aria-label="Loading forecast"
      aria-busy="true"
    >
      <div className="h-5 w-36 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-4 h-32 rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  )
}
