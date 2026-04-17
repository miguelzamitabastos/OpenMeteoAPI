import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import HomePage from '@/app/(pages)/page'

function renderWithQueryProvider(ui: JSX.Element): void {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('Home page integration', () => {
  beforeEach(() => {
    window.localStorage.clear()
    jest.restoreAllMocks()
    ;(globalThis as { fetch?: unknown }).fetch = jest.fn()
  })

  it('resolves geolocation, fetches weather and renders weather card', async () => {
    Object.defineProperty(window.navigator, 'geolocation', {
      configurable: true,
      value: {
        getCurrentPosition: jest.fn((success: PositionCallback) => {
          success({
            coords: { latitude: 40.4, longitude: -3.7 },
          } as GeolocationPosition)
        }),
      },
    })

    const fetchMock = globalThis.fetch as jest.Mock
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        updatedAt: '2026-04-17T10:00:00Z',
        current: {
          temperatureC: 20,
          feelsLikeC: 19,
          weatherCode: 2,
          windSpeedKmh: 12,
          windDirectionDeg: 90,
          humidityPercent: 55,
          pressureHpa: 1012,
          precipitationMm: 0,
          isDay: true,
        },
      }),
    } as unknown as Response)

    renderWithQueryProvider(<HomePage />)

    await waitFor(() => {
      expect(screen.getByText('Current weather')).toBeInTheDocument()
    })

    expect(screen.getByText('20°C')).toBeInTheDocument()
  })

  it('shows manual location search when geolocation is denied', async () => {
    Object.defineProperty(window.navigator, 'geolocation', {
      configurable: true,
      value: {
        getCurrentPosition: jest.fn((_success: PositionCallback, error?: PositionErrorCallback) => {
          if (error !== undefined) {
            error({
              code: 1,
              message: 'Permission denied',
              PERMISSION_DENIED: 1,
              POSITION_UNAVAILABLE: 2,
              TIMEOUT: 3,
            } as GeolocationPositionError)
          }
        }),
      },
    })

    const fetchMock = globalThis.fetch as jest.Mock
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        updatedAt: '2026-04-17T10:00:00Z',
        current: {
          temperatureC: 20,
          feelsLikeC: 19,
          weatherCode: 2,
          windSpeedKmh: 12,
          windDirectionDeg: 90,
          humidityPercent: 55,
          pressureHpa: 1012,
          precipitationMm: 0,
          isDay: true,
        },
      }),
    } as unknown as Response)

    renderWithQueryProvider(<HomePage />)

    await waitFor(() => {
      expect(screen.getByText('Location permission denied. Search for a city.')).toBeInTheDocument()
    })

    expect(screen.getByText('Search location')).toBeInTheDocument()
  })
})
