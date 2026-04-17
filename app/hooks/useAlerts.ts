'use client'

import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { TAlert } from '@/app/lib/alerts'
import type { TCoordinates } from '@/app/hooks/useWeather'

interface TAlertsApiResponse {
  alerts: TAlert[]
}

interface TErrorResponse {
  error: string
}

async function fetchAlerts(coordinates: TCoordinates): Promise<TAlert[]> {
  const searchParams = new URLSearchParams({
    lat: String(coordinates.latitude),
    lon: String(coordinates.longitude),
  })

  const response = await fetch(`/api/alerts?${searchParams.toString()}`)
  if (!response.ok) {
    const payload = (await response.json()) as TErrorResponse
    throw new Error(payload.error || 'Unable to load alerts data')
  }

  const payload = (await response.json()) as TAlertsApiResponse
  return payload.alerts
}

export function useAlerts(
  coordinates: TCoordinates | null,
  enabled = true,
): UseQueryResult<TAlert[], Error> {
  return useQuery<TAlert[], Error>({
    queryKey: ['alerts', coordinates?.latitude, coordinates?.longitude],
    queryFn: () => fetchAlerts(coordinates as TCoordinates),
    enabled: enabled && coordinates !== null,
  })
}
