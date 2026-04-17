import { fetchOpenMeteo } from '@/app/lib/openmeteo'

describe('Open Meteo network behavior', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    ;(globalThis as { fetch?: unknown }).fetch = jest.fn()
  })

  it('returns current weather data on successful request', async () => {
    const fetchMock = globalThis.fetch as jest.Mock
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        current: { temperature_2m: 20, weathercode: 2 },
      }),
    } as unknown as Response)

    const payload = await fetchOpenMeteo<{
      current: { temperature_2m: number; weathercode: number }
    }>({
      latitude: 40.4168,
      longitude: -3.7038,
      params: {
        current: 'temperature_2m,weathercode',
      },
    })

    expect(payload.current.temperature_2m).toBeDefined()
    expect(payload.current.weathercode).toBeDefined()
  })

  it('returns hourly forecast data on successful request', async () => {
    const fetchMock = globalThis.fetch as jest.Mock
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        hourly: {
          time: ['2026-04-17T10:00:00Z'],
          temperature_2m: [20],
        },
      }),
    } as unknown as Response)

    const payload = await fetchOpenMeteo<{
      hourly: { time: string[]; temperature_2m: number[] }
    }>({
      latitude: 40.4168,
      longitude: -3.7038,
      params: {
        hourly: 'time,temperature_2m',
      },
    })

    expect(payload.hourly.time.length).toBeGreaterThan(0)
    expect(payload.hourly.temperature_2m.length).toBe(payload.hourly.time.length)
  })

  it('throws typed error when server responds with 500', async () => {
    const fetchMock = globalThis.fetch as jest.Mock
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Server error',
    } as unknown as Response)

    await expect(
      fetchOpenMeteo({
        latitude: 40.4168,
        longitude: -3.7038,
        params: {
          current: 'temperature_2m,weathercode',
        },
      }),
    ).rejects.toThrow('Failed to fetch Open Meteo data')
  })

  it('throws typed error on network failure', async () => {
    const fetchMock = globalThis.fetch as jest.Mock
    fetchMock.mockRejectedValue(new Error('network failed'))

    await expect(
      fetchOpenMeteo({
        latitude: 40.4168,
        longitude: -3.7038,
        params: {
          current: 'temperature_2m,weathercode',
        },
      }),
    ).rejects.toThrow('Failed to fetch Open Meteo data')
  })

  it('throws typed error on malformed JSON response', async () => {
    const fetchMock = globalThis.fetch as jest.Mock
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON')
      },
    } as unknown as Response)

    await expect(
      fetchOpenMeteo({
        latitude: 40.4168,
        longitude: -3.7038,
        params: {
          current: 'temperature_2m,weathercode',
        },
      }),
    ).rejects.toThrow('Failed to fetch Open Meteo data')
  })
})