import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { useWeather } from '@/app/hooks/useWeather'

function createWrapper(): ({ children }: { children: React.ReactNode }) => JSX.Element {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return function Wrapper({ children }: { children: React.ReactNode }): JSX.Element {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useWeather', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    ;(globalThis as { fetch?: unknown }).fetch = jest.fn()
  })

  it('returns weather payload on successful request', async () => {
    const fetchMock = globalThis.fetch as jest.Mock
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        updatedAt: '2026-04-17T10:00:00Z',
        current: {
          temperatureC: 21,
          feelsLikeC: 20,
          weatherCode: 2,
          windSpeedKmh: 12,
          windDirectionDeg: 80,
          humidityPercent: 50,
          pressureHpa: 1012,
          precipitationMm: 0,
          isDay: true,
        },
      }),
    } as unknown as Response)

    const { result } = renderHook(() => useWeather({ latitude: 40.4, longitude: -3.7 }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.current.temperatureC).toBe(21)
  })

  it('returns error state when API request fails', async () => {
    const fetchMock = globalThis.fetch as jest.Mock
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Bad request' }),
    } as unknown as Response)

    const { result } = renderHook(() => useWeather({ latitude: 40.4, longitude: -3.7 }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.message).toBe('Bad request')
  })
})