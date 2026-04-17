import { WMO_CODES } from '@/app/lib/formatters'

interface TWeatherIconProps {
  code: number
  isDay: boolean
}

export function WeatherIcon({ code, isDay }: TWeatherIconProps): JSX.Element {
  const weather = WMO_CODES[code] ?? { icon: '🌡️', label: 'Unknown conditions' }

  return (
    <div className="inline-flex items-center gap-2" role="img" aria-label={weather.label}>
      <span className="text-4xl">{weather.icon}</span>
      <span className="rounded-full border border-current/30 px-2 py-0.5 text-xs font-semibold uppercase">
        {isDay ? 'Day' : 'Night'}
      </span>
    </div>
  )
}
