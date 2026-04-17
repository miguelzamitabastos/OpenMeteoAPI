export type TSeverity = 'low' | 'medium' | 'high'

export interface TWmoCodeEntry {
  label: string
  icon: string
  severity: TSeverity
}

export const WMO_CODES: Record<number, TWmoCodeEntry> = {
  0: { label: 'Clear sky', icon: '☀️', severity: 'low' },
  1: { label: 'Mainly clear', icon: '🌤️', severity: 'low' },
  2: { label: 'Partly cloudy', icon: '⛅', severity: 'low' },
  3: { label: 'Overcast', icon: '☁️', severity: 'low' },
  45: { label: 'Foggy', icon: '🌫️', severity: 'medium' },
  48: { label: 'Icy fog', icon: '🌫️', severity: 'medium' },
  51: { label: 'Light drizzle', icon: '🌦️', severity: 'low' },
  53: { label: 'Moderate drizzle', icon: '🌦️', severity: 'low' },
  55: { label: 'Dense drizzle', icon: '🌧️', severity: 'medium' },
  61: { label: 'Slight rain', icon: '🌧️', severity: 'low' },
  63: { label: 'Moderate rain', icon: '🌧️', severity: 'medium' },
  65: { label: 'Heavy rain', icon: '🌧️', severity: 'high' },
  71: { label: 'Slight snow', icon: '🌨️', severity: 'medium' },
  73: { label: 'Moderate snow', icon: '❄️', severity: 'medium' },
  75: { label: 'Heavy snow', icon: '❄️', severity: 'high' },
  80: { label: 'Slight showers', icon: '🌦️', severity: 'low' },
  81: { label: 'Moderate showers', icon: '🌧️', severity: 'medium' },
  82: { label: 'Violent showers', icon: '⛈️', severity: 'high' },
  95: { label: 'Thunderstorm', icon: '⛈️', severity: 'high' },
  96: { label: 'Thunderstorm with hail', icon: '⛈️', severity: 'high' },
  99: { label: 'Thunderstorm with heavy hail', icon: '⛈️', severity: 'high' },
}

export function formatTemperature(value: number): string {
  return `${Math.round(value)}°C`
}

const COMPASS_DIRECTIONS: string[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

export function formatWindDirection(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360
  const index = Math.round(normalized / 45) % 8
  return COMPASS_DIRECTIONS[index]
}

export function formatDateTime(value: string): string {
  const date = new Date(value)
  const formatter = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
    hour12: false,
  })

  return formatter.format(date).replace(',', '')
}

export function getWeatherSeverity(code: number): TSeverity {
  return WMO_CODES[code]?.severity ?? 'low'
}
