import type { TWeatherApiResponse } from '@/app/lib/schemas/openmeteo.schema'
import {
  formatDateTime,
  formatTemperature,
  formatWindDirection,
  WMO_CODES,
} from '@/app/lib/formatters'
import { WeatherIcon } from '@/app/components/WeatherIcon'

interface TWeatherCardProps {
  weather: TWeatherApiResponse
}

export function WeatherCard({ weather }: TWeatherCardProps): JSX.Element {
  const code = weather.current.weatherCode
  const decoded = WMO_CODES[code] ?? {
    label: 'Unknown conditions',
    icon: '🌡️',
    severity: 'low' as const,
  }
  const backgroundClass = weather.current.isDay
    ? 'bg-gradient-to-br from-sky-100 via-cyan-50 to-amber-50 text-slate-900'
    : 'bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white ring-1 ring-white/20'

  return (
    <article
      className={`rounded-3xl p-6 shadow-lg ${backgroundClass}`}
      aria-label="Current weather card"
    >
      <header className="flex items-start justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest opacity-90">Current weather</p>
          <h2 className="mt-2 text-6xl font-bold leading-none drop-shadow-sm">
            {formatTemperature(weather.current.temperatureC)}
          </h2>
          <p className="mt-2 text-base opacity-95">
            Feels like {formatTemperature(weather.current.feelsLikeC)}
          </p>
        </div>
        <div className="text-right">
          <WeatherIcon code={code} isDay={weather.current.isDay} />
          <p className="mt-2 text-sm font-medium">{decoded.label}</p>
        </div>
      </header>

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
        <div className="rounded-xl bg-white/55 p-3 backdrop-blur dark:bg-black/35">
          <dt className="opacity-80">Wind</dt>
          <dd className="font-semibold">
            {Math.round(weather.current.windSpeedKmh)} km/h{' '}
            {formatWindDirection(weather.current.windDirectionDeg)}
          </dd>
        </div>
        <div className="rounded-xl bg-white/55 p-3 backdrop-blur dark:bg-black/35">
          <dt className="opacity-80">Humidity</dt>
          <dd className="font-semibold">{weather.current.humidityPercent}%</dd>
        </div>
        <div className="rounded-xl bg-white/55 p-3 backdrop-blur dark:bg-black/35">
          <dt className="opacity-80">Pressure</dt>
          <dd className="font-semibold">{Math.round(weather.current.pressureHpa)} hPa</dd>
        </div>
        <div className="rounded-xl bg-white/55 p-3 backdrop-blur dark:bg-black/35">
          <dt className="opacity-80">Last updated</dt>
          <dd className="font-semibold">{formatDateTime(weather.updatedAt)}</dd>
        </div>
      </dl>
    </article>
  )
}
