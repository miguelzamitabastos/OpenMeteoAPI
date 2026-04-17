'use client'

import { useEffect, useMemo, useState } from 'react'
import type { TAlert } from '@/app/lib/alerts'

interface TAlertBannerProps {
  alerts: TAlert[]
}

const SEVERITY_STYLES: Record<TAlert['severity'], string> = {
  HIGH: 'border-weather-high/50 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-100',
  MEDIUM:
    'border-weather-medium/50 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100',
  LOW: 'border-weather-low/50 bg-sky-50 text-sky-900 dark:bg-sky-950/40 dark:text-sky-100',
}

const SEVERITY_ICON: Record<TAlert['severity'], string> = {
  HIGH: '!!!',
  MEDIUM: '!!',
  LOW: '!',
}

export function AlertBanner({ alerts }: TAlertBannerProps): JSX.Element {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const loadedState = alerts.reduce<Record<string, boolean>>((acc, alert) => {
      const key = `dismissed_alert_${alert.id}`
      acc[alert.id] = window.sessionStorage.getItem(key) === 'true'
      return acc
    }, {})

    setDismissed(loadedState)
  }, [alerts])

  const visibleAlerts = useMemo(() => {
    return alerts.filter((alert) => !dismissed[alert.id])
  }, [alerts, dismissed])

  if (visibleAlerts.length === 0) {
    return (
      <section className="rounded-3xl border border-emerald-300 bg-emerald-50 p-6 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-100">
        <p className="text-lg font-semibold">No active alerts</p>
        <p className="mt-1 text-sm">Conditions are stable for the selected area.</p>
      </section>
    )
  }

  return (
    <section className="space-y-3" aria-label="Weather alerts list">
      {visibleAlerts.map((alert) => {
        const isOpen = expanded[alert.id] === true

        return (
          <article
            key={alert.id}
            className={`rounded-2xl border p-4 shadow-sm ${SEVERITY_STYLES[alert.severity]}`}
          >
            <header className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">
                  {SEVERITY_ICON[alert.severity]} {alert.severity}
                </p>
                <h3 className="text-lg font-semibold">{alert.title}</h3>
                <p className="text-sm opacity-85">
                  {new Date(alert.validFrom).toLocaleString()} -{' '}
                  {new Date(alert.validUntil).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-current/30 px-3 py-1 text-sm"
                  onClick={() => {
                    setExpanded((prev) => ({ ...prev, [alert.id]: !isOpen }))
                  }}
                  aria-label={`Toggle details for ${alert.title}`}
                >
                  {isOpen ? 'Hide details' : 'Show details'}
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-current/30 px-3 py-1 text-sm"
                  onClick={() => {
                    setDismissed((prev) => ({ ...prev, [alert.id]: true }))
                    window.sessionStorage.setItem(`dismissed_alert_${alert.id}`, 'true')
                  }}
                  aria-label={`Dismiss ${alert.title}`}
                >
                  Dismiss
                </button>
              </div>
            </header>
            {isOpen ? <p className="mt-3 text-sm leading-relaxed">{alert.description}</p> : null}
          </article>
        )
      })}
    </section>
  )
}
