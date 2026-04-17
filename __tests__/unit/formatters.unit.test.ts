import {
  formatDateTime,
  formatTemperature,
  formatWindDirection,
  getWeatherSeverity,
} from '@/app/lib/formatters'

describe('formatters', () => {
  it('formats temperature rounding to nearest integer', () => {
    expect(formatTemperature(21.8)).toBe('22°C')
  })

  it('maps wind direction degrees to compass labels', () => {
    expect(formatWindDirection(0)).toBe('N')
    expect(formatWindDirection(90)).toBe('E')
    expect(formatWindDirection(225)).toBe('SW')
  })

  it('formats datetime to HH:mm DD MMM', () => {
    const result = formatDateTime('2026-04-17T10:05:00Z')

    expect(result).toMatch(/\d{2} [A-Za-z]{3} \d{2}:\d{2}/)
  })

  it('returns known severity and defaults unknown to low', () => {
    expect(getWeatherSeverity(95)).toBe('high')
    expect(getWeatherSeverity(999)).toBe('low')
  })
})