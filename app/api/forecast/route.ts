import { NextResponse } from 'next/server'
import { fetchOpenMeteo, parseCoordinates } from '@/app/lib/openmeteo'
import {
  HourlyForecastSchema,
  type THourlyForecast,
  type TForecastApiResponse,
  type TForecastPoint,
} from '@/app/lib/schemas/openmeteo.schema'

interface TErrorResponse {
  error: string
}

function toForecastPoints(source: THourlyForecast): TForecastPoint[] {
  const total = source.hourly.time.length
  const points: TForecastPoint[] = []

  for (let index = 0; index < total; index += 1) {
    points.push({
      time: source.hourly.time[index],
      temperatureC: source.hourly.temperature_2m[index],
      feelsLikeC: source.hourly.apparent_temperature[index],
      precipitationProbabilityPercent: source.hourly.precipitation_probability[index],
      precipitationMm: source.hourly.precipitation[index],
      weatherCode: source.hourly.weathercode[index],
      windSpeedKmh: source.hourly.windspeed_10m[index],
      visibilityM: source.hourly.visibility[index],
      uvIndex: source.hourly.uv_index[index],
    })
  }

  return points
}

function toForecastResponse(source: THourlyForecast): TForecastApiResponse {
  const points = toForecastPoints(source)
  const sunrise = source.daily?.sunrise?.[0]
  const sunset = source.daily?.sunset?.[0]

  return {
    hourly: points,
    range: {
      from: points[0]?.time ?? '',
      until: points[points.length - 1]?.time ?? '',
    },
    sun:
      sunrise !== undefined && sunset !== undefined
        ? {
            sunrise,
            sunset,
          }
        : undefined,
  }
}

export async function GET(
  request: Request,
): Promise<NextResponse<TForecastApiResponse | TErrorResponse>> {
  const coordinates = parseCoordinates(new URL(request.url).searchParams)
  if (coordinates === null) {
    return NextResponse.json(
      { error: 'Invalid coordinates. Provide lat and lon as valid numbers.' },
      { status: 400 },
    )
  }

  try {
    const payload = await fetchOpenMeteo<unknown>({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      params: {
        hourly:
          'temperature_2m,apparent_temperature,precipitation_probability,precipitation,weathercode,windspeed_10m,visibility,uv_index',
        daily: 'sunrise,sunset',
        forecast_days: '2',
        forecast_hours: '24',
      },
    })

    const parsed = HourlyForecastSchema.safeParse(payload)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Forecast provider returned an unexpected response format.' },
        { status: 503 },
      )
    }

    return NextResponse.json(toForecastResponse(parsed.data), { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Forecast service is temporarily unavailable.' },
      { status: 503 },
    )
  }
}
