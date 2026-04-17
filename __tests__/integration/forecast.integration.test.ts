import { fetchOpenMeteo } from '@/app/lib/openmeteo'
import { HourlyForecastSchema } from '@/app/lib/schemas/openmeteo.schema'

describe('forecast data-layer integration', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    ;(globalThis as { fetch?: unknown }).fetch = jest.fn()
  })

  it('fetches hourly forecast payload and validates it with zod schema', async () => {
    const fetchMock = globalThis.fetch as jest.Mock
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        hourly: {
          time: ['2026-04-17T10:00:00Z', '2026-04-17T11:00:00Z'],
          temperature_2m: [20, 21],
          apparent_temperature: [19, 20],
          precipitation_probability: [20, 30],
          precipitation: [0, 0.5],
          weathercode: [2, 3],
          windspeed_10m: [12, 14],
          visibility: [10000, 9000],
          uv_index: [3, 5],
        },
      }),
    } as unknown as Response)

    const payload = await fetchOpenMeteo<unknown>({
      latitude: 40.4,
      longitude: -3.7,
      params: {
        hourly:
          'temperature_2m,apparent_temperature,precipitation_probability,precipitation,weathercode,windspeed_10m,visibility,uv_index',
        forecast_days: '2',
        forecast_hours: '24',
      },
    })

    const parsed = HourlyForecastSchema.safeParse(payload)

    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.hourly.time).toHaveLength(2)
      expect(parsed.data.hourly.temperature_2m[0]).toBe(20)
    }
  })

  it('fails schema validation for malformed payload', async () => {
    const fetchMock = globalThis.fetch as jest.Mock
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ hourly: { bad: [] } }),
    } as unknown as Response)

    const payload = await fetchOpenMeteo<unknown>({
      latitude: 40.4,
      longitude: -3.7,
      params: {
        hourly: 'temperature_2m,weathercode',
      },
    })

    const parsed = HourlyForecastSchema.safeParse(payload)
    expect(parsed.success).toBe(false)
  })
})
