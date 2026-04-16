# 🌤️ Skill — Open Meteo API Integration

## Skill ID
`openmeteo-api-integration`

## Description
This skill provides the AI agent with precise knowledge of how to integrate,
validate, transform, and cache data from the **Open Meteo API** within the
Weather Portal project. Use this skill whenever any task involves fetching,
processing, or displaying meteorological data.

---

## 📡 API Reference

### Base URL
```
https://api.open-meteo.com/v1/forecast
```

### Required Parameters (always include)
| Parameter   | Value            | Description                    |
|-------------|------------------|--------------------------------|
| `latitude`  | `number`         | Location latitude (e.g., 40.4168) |
| `longitude` | `number`         | Location longitude (e.g., -3.7038) |
| `timezone`  | `"auto"`         | Auto-detect timezone from coordinates |

---

## 🔢 Variable Reference by Feature

### Current Weather (`current=`)
```
temperature_2m          → Temperature at 2m in °C
apparent_temperature    → Feels-like temperature
weathercode             → WMO code (see decoder below)
windspeed_10m           → Wind speed at 10m (km/h)
winddirection_10m       → Wind direction (degrees)
precipitation           → Current precipitation (mm)
relative_humidity_2m    → Humidity (%)
surface_pressure        → Pressure (hPa)
is_day                  → 1 = day, 0 = night
```

### 24h Hourly Forecast (`hourly=`)
```
temperature_2m
apparent_temperature
precipitation_probability
precipitation
weathercode
windspeed_10m
visibility
uv_index
```

Always add: `&forecast_days=2` and `&forecast_hours=24`

### Alerts — Derived Logic
> Open Meteo does not have a native alerts endpoint.
> Alerts must be **derived** from thresholds applied to the hourly data:

```typescript
// Alert thresholds (define as constants in lib/alerts.ts)
const ALERT_THRESHOLDS = {
  STORM:         { weathercode: [95, 96, 99] },
  HEAVY_RAIN:    { precipitation_probability: 80, precipitation: 10 },
  STRONG_WIND:   { windspeed_10m: 50 },          // km/h
  EXTREME_UV:    { uv_index: 8 },
  LOW_VISIBILITY:{ visibility: 1000 },            // metres
  FROST:         { temperature_2m: 2 },           // °C
}
```

---

## 🔄 WMO Weather Code Decoder

Implement in `lib/openmeteo.ts` as a lookup map:

```typescript
export const WMO_CODES: Record<number, { label: string; icon: string; severity: 'low' | 'medium' | 'high' }> = {
  0:  { label: 'Clear sky',            icon: '☀️',  severity: 'low' },
  1:  { label: 'Mainly clear',         icon: '🌤️', severity: 'low' },
  2:  { label: 'Partly cloudy',        icon: '⛅',  severity: 'low' },
  3:  { label: 'Overcast',             icon: '☁️',  severity: 'low' },
  45: { label: 'Foggy',               icon: '🌫️', severity: 'medium' },
  48: { label: 'Icy fog',             icon: '🌫️', severity: 'medium' },
  51: { label: 'Light drizzle',       icon: '🌦️', severity: 'low' },
  53: { label: 'Moderate drizzle',    icon: '🌦️', severity: 'low' },
  55: { label: 'Dense drizzle',       icon: '🌧️', severity: 'medium' },
  61: { label: 'Slight rain',         icon: '🌧️', severity: 'low' },
  63: { label: 'Moderate rain',       icon: '🌧️', severity: 'medium' },
  65: { label: 'Heavy rain',          icon: '🌧️', severity: 'high' },
  71: { label: 'Slight snow',         icon: '🌨️', severity: 'medium' },
  73: { label: 'Moderate snow',       icon: '❄️',  severity: 'medium' },
  75: { label: 'Heavy snow',          icon: '❄️',  severity: 'high' },
  80: { label: 'Slight showers',      icon: '🌦️', severity: 'low' },
  81: { label: 'Moderate showers',    icon: '🌧️', severity: 'medium' },
  82: { label: 'Violent showers',     icon: '⛈️',  severity: 'high' },
  95: { label: 'Thunderstorm',        icon: '⛈️',  severity: 'high' },
  96: { label: 'Thunderstorm w/ hail',icon: '⛈️',  severity: 'high' },
  99: { label: 'Thunderstorm w/ heavy hail', icon: '⛈️', severity: 'high' },
}
```

---

## 🧱 Zod Schemas — Always Validate Responses

```typescript
// lib/schemas/openmeteo.schema.ts

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
})

export type TCurrentWeather = z.infer<typeof CurrentWeatherSchema>
export type THourlyForecast = z.infer<typeof HourlyForecastSchema>
```

---

## 🌐 API Client Implementation Pattern

```typescript
// lib/openmeteo.ts

const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

interface FetchWeatherParams {
  latitude: number
  longitude: number
  params: Record<string, string>
  cacheSeconds?: number
}

export async function fetchOpenMeteo<T>({
  latitude,
  longitude,
  params,
  cacheSeconds = 600,
}: FetchWeatherParams): Promise<T> {
  const searchParams = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    timezone: 'auto',
    ...params,
  })

  const response = await fetch(`${BASE_URL}?${searchParams}`, {
    next: { revalidate: cacheSeconds },
  })

  if (!response.ok) {
    throw new Error(`Open Meteo API error: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}
```

---

## 🧪 MSW Mock Handlers for Tests

```typescript
// __tests__/mocks/handlers.ts
import { http, HttpResponse } from 'msw'
import { currentWeatherFixture, hourlyForecastFixture } from './fixtures'

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

// Error handler variants (use in specific tests)
export const errorHandlers = [
  http.get('https://api.open-meteo.com/v1/forecast', () => {
    return HttpResponse.json({ error: 'Server error' }, { status: 500 })
  }),
]

export const networkErrorHandler = [
  http.get('https://api.open-meteo.com/v1/forecast', () => {
    return HttpResponse.networkError()
  }),
]
```

---

## 🗺️ Geolocation Strategy

1. Use browser `navigator.geolocation` for auto-detect.
2. Fallback to a **search input** using Open Meteo Geocoding API:
   ```
   GET https://geocoding-api.open-meteo.com/v1/search?name={city}&count=5&language=es
   ```
3. Store last known coordinates in `localStorage` for persistence.
4. Default coordinates if all else fails: Madrid, Spain (40.4168, -3.7038).
