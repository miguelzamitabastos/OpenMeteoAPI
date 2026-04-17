'use client'

import { useState } from 'react'
import type { TCoordinates } from '@/app/hooks/useWeather'

interface TLocationSearchProps {
  onLocationSelected: (coordinates: TCoordinates) => void
}

interface TGeoResult {
  latitude: number
  longitude: number
  name: string
  country?: string
}

interface TGeoPayload {
  results?: TGeoResult[]
}

export function LocationSearch({ onLocationSelected }: TLocationSearchProps): JSX.Element {
  const [query, setQuery] = useState<string>('')
  const [results, setResults] = useState<TGeoResult[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (): Promise<void> => {
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setError('Enter at least 2 characters')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=5&language=en`,
      )
      const payload = (await response.json()) as TGeoPayload
      setResults(payload.results ?? [])
    } catch {
      setError('Unable to fetch locations')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h2 className="text-lg font-semibold">Search location</h2>
      <div className="mt-3 flex gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="City name"
          className="w-full rounded-xl border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none ring-sky-500 focus:ring dark:border-slate-600"
          aria-label="Location search input"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
          aria-label="Search city"
        >
          Search
        </button>
      </div>
      {isLoading ? <p className="mt-2 text-sm text-slate-500">Searching...</p> : null}
      {error !== null ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      <ul className="mt-3 space-y-2">
        {results.map((result) => {
          const label =
            result.country !== undefined ? `${result.name}, ${result.country}` : result.name
          return (
            <li key={`${result.name}-${result.latitude}-${result.longitude}`}>
              <button
                type="button"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/40"
                onClick={() => {
                  onLocationSelected({
                    latitude: result.latitude,
                    longitude: result.longitude,
                  })
                }}
                aria-label={`Select ${label}`}
              >
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
