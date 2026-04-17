'use client'

import { HourlyForecast } from '@/app/components/HourlyForecast'
import { ForecastSkeleton } from '@/app/components/skeletons/ForecastSkeleton'
import { useForecast } from '@/app/hooks/useForecast'
import type { TCoordinates } from '@/app/hooks/useWeather'

const DEFAULT_COORDINATES: TCoordinates = { latitude: 40.4168, longitude: -3.7038 }

export default function ForecastPage(): JSX.Element {
  const forecastQuery = useForecast(DEFAULT_COORDINATES)

  return (
    <main className="min-h-screen bg-[linear-gradient(160deg,#eff6ff_0%,#ffffff_55%,#ecfeff_100%)] px-4 py-8 dark:bg-[linear-gradient(160deg,#0f172a_0%,#020617_55%,#082f49_100%)] sm:px-8">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold tracking-tight">24h Forecast</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Rolling 24-hour forecast from the current local time.
        </p>

        <div className="mt-6">
          {forecastQuery.isLoading ? <ForecastSkeleton /> : null}

          {forecastQuery.isError ? (
            <section
              className="rounded-2xl border border-red-300 bg-red-50 p-4 text-red-900 dark:border-red-700 dark:bg-red-950/40 dark:text-red-100"
              role="alert"
              aria-live="assertive"
            >
              {forecastQuery.error.message}
            </section>
          ) : null}

          {forecastQuery.data !== undefined ? <HourlyForecast forecast={forecastQuery.data} /> : null}
        </div>
      </section>
    </main>
  )
}