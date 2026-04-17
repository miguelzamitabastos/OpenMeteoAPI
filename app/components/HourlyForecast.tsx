import type { TForecastApiResponse, TForecastPoint } from '@/app/lib/schemas/openmeteo.schema'
import { formatTemperature, WMO_CODES } from '@/app/lib/formatters'

interface THourlyForecastProps {
  forecast: TForecastApiResponse
}

function precipitationClass(probability: number): string {
  if (probability < 30) {
    return 'text-slate-500'
  }

  if (probability <= 60) {
    return 'text-sky-600'
  }

  return 'text-blue-900 dark:text-blue-300'
}

function getNext24Hours(points: TForecastPoint[]): TForecastPoint[] {
  const now = Date.now()
  const firstFutureIndex = points.findIndex((point) => new Date(point.time).getTime() >= now)
  const startIndex = firstFutureIndex === -1 ? 0 : firstFutureIndex

  return points.slice(startIndex, startIndex + 24)
}

function trendWidthClass(ratio: number): string {
  if (ratio < 0.15) {
    return 'w-[12%]'
  }
  if (ratio < 0.3) {
    return 'w-1/4'
  }
  if (ratio < 0.45) {
    return 'w-1/3'
  }
  if (ratio < 0.6) {
    return 'w-1/2'
  }
  if (ratio < 0.75) {
    return 'w-2/3'
  }
  if (ratio < 0.9) {
    return 'w-3/4'
  }
  return 'w-full'
}

export function HourlyForecast({ forecast }: THourlyForecastProps): JSX.Element {
  const points = getNext24Hours(forecast.hourly)

  if (points.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <p className="text-sm text-slate-600 dark:text-slate-300">No forecast data available.</p>
      </section>
    )
  }

  const temperatures = points.map((point) => point.temperatureC)
  const minTemp = Math.min(...temperatures)
  const maxTemp = Math.max(...temperatures)
  const uvPeak = Math.max(...points.map((point) => point.uvIndex))

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-800/90">
      <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Next 24 hours</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">UV peak: {uvPeak.toFixed(1)}</p>
          {forecast.sun !== undefined ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Sunrise:{' '}
              {new Date(forecast.sun.sunrise).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              | Sunset:{' '}
              {new Date(forecast.sun.sunset).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          ) : null}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          {Math.round(minTemp)}° to {Math.round(maxTemp)}°
        </p>
      </header>

      <ul className="flex gap-3 overflow-x-auto pb-3" aria-label="24 hour forecast list">
        {points.map((point, index) => {
          const isCurrent = index === 0
          const weather = WMO_CODES[point.weatherCode] ?? { icon: '🌡️', label: 'Unknown' }
          const ratio = (point.temperatureC - minTemp) / Math.max(maxTemp - minTemp, 1)

          return (
            <li
              key={point.time}
              className={`min-w-[120px] rounded-2xl border p-3 ${
                isCurrent
                  ? 'border-sky-500 bg-sky-50 dark:border-sky-300 dark:bg-sky-900/30'
                  : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/30'
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {new Date(point.time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </p>
              <p className="mt-2 text-2xl" aria-hidden="true">
                {weather.icon}
              </p>
              <p className="mt-1 text-sm font-semibold">{formatTemperature(point.temperatureC)}</p>
              <p
                className={`mt-1 text-xs font-medium ${precipitationClass(point.precipitationProbabilityPercent)}`}
              >
                Rain {Math.round(point.precipitationProbabilityPercent)}%
              </p>
              <div className="mt-3 h-1.5 rounded bg-slate-200 dark:bg-slate-700">
                <div
                  className={`h-full rounded bg-gradient-to-r from-cyan-500 to-blue-600 ${trendWidthClass(ratio)}`}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
