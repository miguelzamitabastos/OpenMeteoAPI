export function WeatherCardSkeleton(): JSX.Element {
  return (
    <div
      className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
      aria-label="Loading current weather"
      aria-busy="true"
    >
      <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-4 h-14 w-40 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="h-14 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-14 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-14 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-14 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  )
}
