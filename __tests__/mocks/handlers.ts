import { http, HttpResponse } from 'msw'
import { currentWeatherFixture } from '@/__tests__/mocks/fixtures/current-weather.fixture'
import { hourlyForecastFixture } from '@/__tests__/mocks/fixtures/hourly-forecast.fixture'

export const handlers = [
  http.get('https://api.open-meteo.com/v1/forecast', ({ request }) => {
    const url = new URL(request.url)

    if (url.searchParams.has('current')) {
      return HttpResponse.json(currentWeatherFixture)
    }

    if (url.searchParams.has('hourly')) {
      return HttpResponse.json(hourlyForecastFixture)
    }

    return HttpResponse.json({ error: 'Unknown request' }, { status: 400 })
  }),
]

export const errorHandlers = [
  http.get('https://api.open-meteo.com/v1/forecast', () => {
    return HttpResponse.json({ error: 'Server error' }, { status: 500 })
  }),
]

export const networkErrorHandler = [
  http.get('https://api.open-meteo.com/v1/forecast', () => {
    return HttpResponse.error()
  }),
]

export const malformedJsonHandlers = [
  http.get('https://api.open-meteo.com/v1/forecast', () => {
    return new HttpResponse('{"broken":', {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }),
]
