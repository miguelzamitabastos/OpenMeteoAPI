import { render, screen } from '@testing-library/react'
import HomePage from '@/app/(pages)/page'
import { useWeather } from '@/app/hooks/useWeather'

jest.mock('@/app/hooks/useWeather', () => ({
  useWeather: jest.fn(),
}))

const mockedUseWeather = useWeather as jest.MockedFunction<typeof useWeather>

describe('Weather card mock states', () => {
  beforeEach(() => {
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
  })

  it('renders API error state from weather hook', async () => {
    mockedUseWeather.mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error('Weather service is down'),
      data: undefined,
    } as ReturnType<typeof useWeather>)

    render(<HomePage />)

    expect(await screen.findByText('Weather service is down')).toBeInTheDocument()
  })

  it('renders weather card data from weather hook', async () => {
    mockedUseWeather.mockReturnValue({
      isLoading: false,
      isError: false,
      error: null,
      data: {
        updatedAt: '2026-04-17T10:00:00Z',
        current: {
          temperatureC: 22,
          feelsLikeC: 21,
          weatherCode: 2,
          windSpeedKmh: 13,
          windDirectionDeg: 90,
          humidityPercent: 55,
          pressureHpa: 1012,
          precipitationMm: 0,
          isDay: true,
        },
      },
    } as unknown as ReturnType<typeof useWeather>)

    render(<HomePage />)

    expect(await screen.findByText('Current weather')).toBeInTheDocument()
    expect(screen.getByText('22°C')).toBeInTheDocument()
  })
})