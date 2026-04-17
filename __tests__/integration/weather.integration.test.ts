import { fetchOpenMeteo } from '@/app/lib/openmeteo'
import { CurrentWeatherSchema } from '@/app/lib/schemas/openmeteo.schema'

describe('weather data-layer integration', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    ;(globalThis as { fetch?: unknown }).fetch = jest.fn()
  })

  it('fetches weather payload and validates it with zod schema', async () => {
    const fetchMock = globalThis.fetch as jest.Mock
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        current: {
          time: '2026-04-17T10:00:00Z',
          temperature_2m: 20,
          apparent_temperature: 19,
          weathercode: 2,
          windspeed_10m: 13,
          winddirection_10m: 90,
          precipitation: 0,
          relative_humidity_2m: 55,
          surface_pressure: 1012,
          is_day: 1,
        },
        current_units: {
          temperature_2m: '°C',
          windspeed_10m: 'km/h',
        },
      }),
    } as unknown as Response)

    const payload = await fetchOpenMeteo<unknown>({
      latitude: 40.4,
      longitude: -3.7,
      params: {
        current:
          'temperature_2m,apparent_temperature,weathercode,windspeed_10m,winddirection_10m,precipitation,relative_humidity_2m,surface_pressure,is_day',
      },
    })

    const parsed = CurrentWeatherSchema.safeParse(payload)

    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.current.temperature_2m).toBe(20)
    }
  })

  it('returns fetch error when provider returns non-ok response', async () => {
    const fetchMock = globalThis.fetch as jest.Mock
    fetchMock.mockResolvedValue({
      ok: false,
      status: 503,
      statusText: 'Service unavailable',
      json: async () => ({ error: 'service unavailable' }),
    } as unknown as Response)

    await expect(
      fetchOpenMeteo({
        latitude: 40.4,
        longitude: -3.7,
        params: {
          current: 'temperature_2m,weathercode',
        },
      }),
    ).rejects.toThrow('Failed to fetch Open Meteo data')
  })
})
