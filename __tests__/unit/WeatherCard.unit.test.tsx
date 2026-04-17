import { render, screen } from '@testing-library/react'
import { WeatherCard } from '@/app/components/WeatherCard'
import type { TWeatherApiResponse } from '@/app/lib/schemas/openmeteo.schema'

const weatherFixture: TWeatherApiResponse = {
  updatedAt: '2026-04-17T10:00:00Z',
  current: {
    temperatureC: 21.4,
    feelsLikeC: 20.8,
    weatherCode: 2,
    windSpeedKmh: 14,
    windDirectionDeg: 90,
    humidityPercent: 55,
    pressureHpa: 1013,
    precipitationMm: 0,
    isDay: true,
  },
}

describe('WeatherCard', () => {
  it('renders key weather metrics and metadata', () => {
    render(<WeatherCard weather={weatherFixture} />)

    expect(screen.getByLabelText('Current weather card')).toBeInTheDocument()
    expect(screen.getByText('Current weather')).toBeInTheDocument()
    expect(screen.getByText('21°C')).toBeInTheDocument()
    expect(screen.getByText(/Feels like 21°C/i)).toBeInTheDocument()
    expect(screen.getByText(/Humidity/i)).toBeInTheDocument()
    expect(screen.getByText('55%')).toBeInTheDocument()
    expect(screen.getByText(/Pressure/i)).toBeInTheDocument()
    expect(screen.getByText('1013 hPa')).toBeInTheDocument()
  })
})