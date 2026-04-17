'use client'

import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { TForecastApiResponse } from '@/app/lib/schemas/openmeteo.schema'
import type { TCoordinates } from '@/app/hooks/useWeather'

interface TErrorResponse {
  error: string
}

async function fetchForecast(coordinates: TCoordinates): Promise<TForecastApiResponse> {
  const searchParams = new URLSearchParams({
    lat: String(coordinates.latitude),
    lon: String(coordinates.longitude),
  })

  const response = await fetch(`/api/forecast?${searchParams.toString()}`)
  if (!response.ok) {
    const payload = (await response.json()) as TErrorResponse
    throw new Error(payload.error || 'Unable to load forecast data')
  }

  return (await response.json()) as TForecastApiResponse
}

export function useForecast(
  coordinates: TCoordinates | null,
  enabled = true,
): UseQueryResult<TForecastApiResponse, Error> {
  return useQuery<TForecastApiResponse, Error>({
    queryKey: ['forecast', coordinates?.latitude, coordinates?.longitude],
    queryFn: () => fetchForecast(coordinates as TCoordinates),
    enabled: enabled && coordinates !== null,
  })
}