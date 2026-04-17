import { render, screen } from '@testing-library/react'
import { HourlyForecast } from '@/app/components/HourlyForecast'
import type { TForecastApiResponse } from '@/app/lib/schemas/openmeteo.schema'

const forecastFixture: TForecastApiResponse = {
  hourly: [
    {
      time: '2026-04-17T10:00:00Z',
      temperatureC: 19,
      feelsLikeC: 18,
      precipitationProbabilityPercent: 20,
      precipitationMm: 0,
      weatherCode: 1,
      windSpeedKmh: 10,
      visibilityM: 10000,
      uvIndex: 3,
    },
    {
      time: '2026-04-17T11:00:00Z',
      temperatureC: 23,
      feelsLikeC: 22,
      precipitationProbabilityPercent: 70,
      precipitationMm: 5,
      weatherCode: 63,
      windSpeedKmh: 16,
      visibilityM: 8000,
      uvIndex: 8,
    },
  ],
  range: {
    from: '2026-04-17T10:00:00Z',
    until: '2026-04-17T11:00:00Z',
  },
  sun: {
    sunrise: '2026-04-17T06:30:00Z',
    sunset: '2026-04-17T18:50:00Z',
  },
}

describe('HourlyForecast', () => {
  it('renders hourly cards, UV peak and sun data', () => {
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2026-04-17T09:30:00Z').getTime())

    render(<HourlyForecast forecast={forecastFixture} />)

    expect(screen.getByText('Next 24 hours')).toBeInTheDocument()
    expect(screen.getByText('UV peak: 8.0')).toBeInTheDocument()
    expect(screen.getByLabelText('24 hour forecast list')).toBeInTheDocument()
    expect(screen.getByText(/Sunrise:/i)).toBeInTheDocument()
    expect(screen.getByText(/Rain 70%/i)).toBeInTheDocument()

    ;(Date.now as jest.Mock).mockRestore()
  })

  it('renders empty-state when there are no points', () => {
    render(
      <HourlyForecast
        forecast={{
          hourly: [],
          range: { from: '', until: '' },
        }}
      />,
    )

    expect(screen.getByText('No forecast data available.')).toBeInTheDocument()
  })
})