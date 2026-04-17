import { z } from 'zod'

export const CurrentWeatherSchema = z.object({
  current: z.object({
    time: z.string(),
    temperature_2m: z.number(),
    apparent_temperature: z.number(),
    weathercode: z.number(),
    windspeed_10m: z.number(),
    winddirection_10m: z.number(),
    precipitation: z.number(),
    relative_humidity_2m: z.number(),
    surface_pressure: z.number(),
    is_day: z.number(),
  }),
  current_units: z.object({
    temperature_2m: z.string(),
    windspeed_10m: z.string(),
  }),
})

export const HourlyForecastSchema = z.object({
  hourly: z.object({
    time: z.array(z.string()),
    temperature_2m: z.array(z.number()),
    apparent_temperature: z.array(z.number()),
    precipitation_probability: z.array(z.number()),
    precipitation: z.array(z.number()),
    weathercode: z.array(z.number()),
    windspeed_10m: z.array(z.number()),
    visibility: z.array(z.number()),
    uv_index: z.array(z.number()),
  }),
  daily: z
    .object({
      sunrise: z.array(z.string()),
      sunset: z.array(z.string()),
    })
    .optional(),
})

export type TCurrentWeather = z.infer<typeof CurrentWeatherSchema>
export type THourlyForecast = z.infer<typeof HourlyForecastSchema>

export interface TWeatherApiResponse {
  updatedAt: string
  current: {
    temperatureC: number
    feelsLikeC: number
    weatherCode: number
    windSpeedKmh: number
    windDirectionDeg: number
    humidityPercent: number
    pressureHpa: number
    precipitationMm: number
    isDay: boolean
  }
}

export interface TForecastPoint {
  time: string
  temperatureC: number
  feelsLikeC: number
  precipitationProbabilityPercent: number
  precipitationMm: number
  weatherCode: number
  windSpeedKmh: number
  visibilityM: number
  uvIndex: number
}

export interface TForecastApiResponse {
  hourly: TForecastPoint[]
  range: {
    from: string
    until: string
  }
  sun?: {
    sunrise: string
    sunset: string
  }
}