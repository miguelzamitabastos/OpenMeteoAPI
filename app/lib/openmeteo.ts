const BASE_URL = 'https://api.open-meteo.com/v1/forecast'
const DEFAULT_LATITUDE = Number(process.env.NEXT_PUBLIC_DEFAULT_LAT ?? '40.4168')
const DEFAULT_LONGITUDE = Number(process.env.NEXT_PUBLIC_DEFAULT_LON ?? '-3.7038')

interface FetchOpenMeteoParams {
  latitude: number
  longitude: number
  params: Record<string, string>
  cacheSeconds?: number
}

export interface TCoordinates {
  latitude: number
  longitude: number
}

export function getDefaultCoordinates(): TCoordinates {
  return {
    latitude: Number.isFinite(DEFAULT_LATITUDE) ? DEFAULT_LATITUDE : 40.4168,
    longitude: Number.isFinite(DEFAULT_LONGITUDE) ? DEFAULT_LONGITUDE : -3.7038,
  }
}

export function parseCoordinates(searchParams: URLSearchParams): TCoordinates | null {
  const latRaw = searchParams.get('lat')
  const lonRaw = searchParams.get('lon')

  if (latRaw === null && lonRaw === null) {
    return getDefaultCoordinates()
  }

  if (latRaw === null || lonRaw === null) {
    return null
  }

  const latitude = Number(latRaw)
  const longitude = Number(lonRaw)

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return null
  }

  return { latitude, longitude }
}

export async function fetchOpenMeteo<T>({
  latitude,
  longitude,
  params,
  cacheSeconds = 600,
}: FetchOpenMeteoParams): Promise<T> {
  try {
    const searchParams = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      timezone: 'auto',
      ...params,
    })

    const response = await fetch(`${BASE_URL}?${searchParams.toString()}`, {
      next: { revalidate: cacheSeconds },
    })

    if (!response.ok) {
      throw new Error(`Open Meteo API error: ${response.status} ${response.statusText}`)
    }

    return (await response.json()) as T
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch Open Meteo data: ${error.message}`)
    }

    throw new Error('Failed to fetch Open Meteo data due to an unknown error')
  }
}
