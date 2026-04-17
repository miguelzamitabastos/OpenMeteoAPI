import { NextResponse } from 'next/server'
import { deriveAlerts, type TAlert, type THourlyAlertInput } from '@/app/lib/alerts'
import { fetchOpenMeteo, parseCoordinates } from '@/app/lib/openmeteo'
import { HourlyForecastSchema } from '@/app/lib/schemas/openmeteo.schema'

interface TErrorResponse {
  error: string
}

interface TAlertsApiResponse {
  alerts: TAlert[]
}

function toAlertInput(payload: {
  hourly: {
    time: string[]
    temperature_2m: number[]
    precipitation_probability: number[]
    precipitation: number[]
    weathercode: number[]
    windspeed_10m: number[]
    visibility: number[]
    uv_index: number[]
  }
}): THourlyAlertInput {
  return {
    time: payload.hourly.time,
    temperature_2m: payload.hourly.temperature_2m,
    precipitation_probability: payload.hourly.precipitation_probability,
    precipitation: payload.hourly.precipitation,
    weathercode: payload.hourly.weathercode,
    windspeed_10m: payload.hourly.windspeed_10m,
    visibility: payload.hourly.visibility,
    uv_index: payload.hourly.uv_index,
  }
}

export async function GET(request: Request): Promise<NextResponse<TAlertsApiResponse | TErrorResponse>> {
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
        forecast_days: '2',
        forecast_hours: '24',
      },
    })

    const parsed = HourlyForecastSchema.safeParse(payload)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Alerts provider returned an unexpected response format.' },
        { status: 503 },
      )
    }

    const alerts = deriveAlerts(toAlertInput(parsed.data))
    return NextResponse.json({ alerts }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Alerts service is temporarily unavailable.' }, { status: 503 })
  }
}