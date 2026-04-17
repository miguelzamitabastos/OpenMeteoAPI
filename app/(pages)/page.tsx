'use client'

import { useEffect, useMemo, useState } from 'react'
import { LocationSearch } from '@/app/components/LocationSearch'
import { WeatherCard } from '@/app/components/WeatherCard'
import { WeatherCardSkeleton } from '@/app/components/skeletons/WeatherCardSkeleton'
import { useWeather, type TCoordinates } from '@/app/hooks/useWeather'

const STORAGE_KEY = 'weather_location'
const DEFAULT_COORDINATES: TCoordinates = { latitude: 40.4168, longitude: -3.7038 }

export default function HomePage(): JSX.Element {
  const [coordinates, setCoordinates] = useState<TCoordinates | null>(null)
  const [isResolvingLocation, setIsResolvingLocation] = useState<boolean>(true)
  const [locationDenied, setLocationDenied] = useState<boolean>(false)

  useEffect(() => {
    const storedRaw = window.localStorage.getItem(STORAGE_KEY)
    if (storedRaw !== null) {
      try {
        const parsed = JSON.parse(storedRaw) as TCoordinates
        if (typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
          setCoordinates(parsed)
          setIsResolvingLocation(false)
          return
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    }

    if (!navigator.geolocation) {
      setCoordinates(DEFAULT_COORDINATES)
      setIsResolvingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        setCoordinates(nextCoordinates)
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCoordinates))
        setIsResolvingLocation(false)
      },
      () => {
        setLocationDenied(true)
        setCoordinates(DEFAULT_COORDINATES)
        setIsResolvingLocation(false)
      },
    )
  }, [])

  const weatherQuery = useWeather(coordinates, !isResolvingLocation)

  const subtitle = useMemo((): string => {
    if (locationDenied) {
      return 'Location permission denied. Search for a city.'
    }

    if (coordinates === null) {
      return 'Finding your location...'
    }

    return `Coordinates: ${coordinates.latitude.toFixed(2)}, ${coordinates.longitude.toFixed(2)}`
  }, [coordinates, locationDenied])

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#f0f9ff_35%,#f8fafc_100%)] px-4 py-8 dark:bg-[radial-gradient(circle_at_top,#0f172a_0%,#020617_60%,#000000_100%)] sm:px-8">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold tracking-tight">Weather Portal</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>

        <div className="mt-6 space-y-6">
          {isResolvingLocation ? <WeatherCardSkeleton /> : null}

          {!isResolvingLocation && locationDenied ? (
            <LocationSearch
              onLocationSelected={(selectedCoordinates) => {
                setCoordinates(selectedCoordinates)
                setLocationDenied(false)
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedCoordinates))
              }}
            />
          ) : null}

          {!isResolvingLocation && weatherQuery.isLoading ? <WeatherCardSkeleton /> : null}

          {!isResolvingLocation && weatherQuery.isError ? (
            <section
              className="rounded-2xl border border-red-300 bg-red-50 p-4 text-red-900 dark:border-red-700 dark:bg-red-950/40 dark:text-red-100"
              role="alert"
              aria-live="assertive"
            >
              {weatherQuery.error.message}
            </section>
          ) : null}

          {!isResolvingLocation && weatherQuery.data !== undefined ? (
            <WeatherCard weather={weatherQuery.data} />
          ) : null}
        </div>
      </section>
    </main>
  )
}