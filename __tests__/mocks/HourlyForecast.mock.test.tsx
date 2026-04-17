import { render, screen } from '@testing-library/react'
import ForecastPage from '@/app/(pages)/forecast/page'
import { useForecast } from '@/app/hooks/useForecast'

jest.mock('@/app/hooks/useForecast', () => ({
  useForecast: jest.fn(),
}))

const mockedUseForecast = useForecast as jest.MockedFunction<typeof useForecast>

describe('Hourly forecast mock states', () => {
  it('renders error state when forecast hook fails', () => {
    mockedUseForecast.mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error('Forecast unavailable'),
      data: undefined,
    } as ReturnType<typeof useForecast>)

    render(<ForecastPage />)

    expect(screen.getByText('Forecast unavailable')).toBeInTheDocument()
  })

  it('renders hourly forecast cards with successful data', () => {
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2026-04-17T09:00:00Z').getTime())

    mockedUseForecast.mockReturnValue({
      isLoading: false,
      isError: false,
      error: null,
      data: {
        hourly: [
          {
            time: '2026-04-17T10:00:00Z',
            temperatureC: 20,
            feelsLikeC: 19,
            precipitationProbabilityPercent: 50,
            precipitationMm: 1,
            weatherCode: 2,
            windSpeedKmh: 10,
            visibilityM: 10000,
            uvIndex: 4,
          },
        ],
        range: {
          from: '2026-04-17T10:00:00Z',
          until: '2026-04-17T10:00:00Z',
        },
      },
    } as ReturnType<typeof useForecast>)

    render(<ForecastPage />)

    expect(screen.getByText('Next 24 hours')).toBeInTheDocument()
    expect(screen.getByText('20°C')).toBeInTheDocument()
    ;(Date.now as jest.Mock).mockRestore()
  })
})
