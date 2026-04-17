import { NextResponse } from 'next/server'
import { fetchOpenMeteo, parseCoordinates } from '@/app/lib/openmeteo'
import {
  CurrentWeatherSchema,
  type TCurrentWeather,
  type TWeatherApiResponse,
} from '@/app/lib/schemas/openmeteo.schema'

interface TErrorResponse {
  error: string
}

function toWeatherResponse(source: TCurrentWeather): TWeatherApiResponse {
  return {
    updatedAt: source.current.time,
    current: {
      temperatureC: source.current.temperature_2m,
      feelsLikeC: source.current.apparent_temperature,
      weatherCode: source.current.weathercode,
      windSpeedKmh: source.current.windspeed_10m,
      windDirectionDeg: source.current.winddirection_10m,
      humidityPercent: source.current.relative_humidity_2m,
      pressureHpa: source.current.surface_pressure,
      precipitationMm: source.current.precipitation,
      isDay: source.current.is_day === 1,
    },
  }
}

export async function GET(request: Request): Promise<NextResponse<TWeatherApiResponse | TErrorResponse>> {
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
        current:
          'temperature_2m,apparent_temperature,weathercode,windspeed_10m,winddirection_10m,precipitation,relative_humidity_2m,surface_pressure,is_day',
      },
    })

    const parsed = CurrentWeatherSchema.safeParse(payload)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Weather provider returned an unexpected response format.' },
        { status: 503 },
      )
    }

    return NextResponse.json(toWeatherResponse(parsed.data), { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Weather service is temporarily unavailable.' }, { status: 503 })
  }
}