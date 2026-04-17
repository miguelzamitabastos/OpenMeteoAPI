'use client'

import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { TWeatherApiResponse } from '@/app/lib/schemas/openmeteo.schema'

export interface TCoordinates {
  latitude: number
  longitude: number
}

interface TErrorResponse {
  error: string
}

async function fetchWeather(coordinates: TCoordinates): Promise<TWeatherApiResponse> {
  const searchParams = new URLSearchParams({
    lat: String(coordinates.latitude),
    lon: String(coordinates.longitude),
  })

  const response = await fetch(`/api/weather?${searchParams.toString()}`)
  if (!response.ok) {
    const payload = (await response.json()) as TErrorResponse
    throw new Error(payload.error || 'Unable to load weather data')
  }

  return (await response.json()) as TWeatherApiResponse
}

export function useWeather(
  coordinates: TCoordinates | null,
  enabled = true,
): UseQueryResult<TWeatherApiResponse, Error> {
  return useQuery<TWeatherApiResponse, Error>({
    queryKey: ['weather', coordinates?.latitude, coordinates?.longitude],
    queryFn: () => fetchWeather(coordinates as TCoordinates),
    enabled: enabled && coordinates !== null,
  })
}