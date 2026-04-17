'use client'

import { AlertBanner } from '@/app/components/AlertBanner'
import { AlertsSkeleton } from '@/app/components/skeletons/AlertsSkeleton'
import { useAlerts } from '@/app/hooks/useAlerts'
import type { TCoordinates } from '@/app/hooks/useWeather'

const DEFAULT_COORDINATES: TCoordinates = { latitude: 40.4168, longitude: -3.7038 }

export default function AlertsPage(): JSX.Element {
  const alertsQuery = useAlerts(DEFAULT_COORDINATES)

  return (
    <main className="min-h-screen bg-[linear-gradient(145deg,#fff7ed_0%,#fffbeb_35%,#f8fafc_100%)] px-4 py-8 dark:bg-[linear-gradient(145deg,#111827_0%,#0f172a_35%,#020617_100%)] sm:px-8">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold tracking-tight">Weather Alerts</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Derived risk warnings from the next 24 hours of forecast data.
        </p>

        <div className="mt-6">
          {alertsQuery.isLoading ? <AlertsSkeleton /> : null}

          {alertsQuery.isError ? (
            <section
              className="rounded-2xl border border-red-300 bg-red-50 p-4 text-red-900 dark:border-red-700 dark:bg-red-950/40 dark:text-red-100"
              role="alert"
              aria-live="assertive"
            >
              {alertsQuery.error.message}
            </section>
          ) : null}

          {alertsQuery.data !== undefined ? <AlertBanner alerts={alertsQuery.data} /> : null}
        </div>
      </section>
    </main>
  )
}
