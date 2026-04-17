import { deriveAlerts, type THourlyAlertInput } from '@/app/lib/alerts'

function makeBaseHourly(): THourlyAlertInput {
  return {
    time: ['2026-04-17T10:00', '2026-04-17T11:00'],
    temperature_2m: [12, 13],
    precipitation_probability: [10, 10],
    precipitation: [0, 0],
    weathercode: [2, 2],
    windspeed_10m: [15, 18],
    visibility: [12000, 10000],
    uv_index: [2, 3],
  }
}

describe('deriveAlerts', () => {
  it('returns empty array when there are no times', () => {
    const alerts = deriveAlerts({
      ...makeBaseHourly(),
      time: [],
    })

    expect(alerts).toEqual([])
  })

  it('creates alert at exact heavy-rain threshold boundary', () => {
    const hourly = makeBaseHourly()
    hourly.precipitation_probability = [80, 10]
    hourly.precipitation = [10, 0]

    const alerts = deriveAlerts(hourly)
    const hasHeavyRain = alerts.some((alert) => alert.type === 'HEAVY_RAIN')

    expect(hasHeavyRain).toBe(true)
  })

  it('sorts alerts by severity with high first', () => {
    const hourly = makeBaseHourly()
    hourly.weathercode = [95, 2]
    hourly.visibility = [900, 10000]

    const alerts = deriveAlerts(hourly)

    expect(alerts.length).toBeGreaterThanOrEqual(2)
    expect(alerts[0]?.severity).toBe('HIGH')
  })
})
