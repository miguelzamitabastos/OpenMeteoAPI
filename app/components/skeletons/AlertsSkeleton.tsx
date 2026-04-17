export function AlertsSkeleton(): JSX.Element {
  return (
    <div className="animate-pulse space-y-3" aria-label="Loading alerts" aria-busy="true">
      <div className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-700" />
      <div className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-700" />
    </div>
  )
}