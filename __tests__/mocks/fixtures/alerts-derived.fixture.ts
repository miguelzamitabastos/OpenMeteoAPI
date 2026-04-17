import type { TAlert } from '@/app/lib/alerts'

export const alertsDerivedFixture: TAlert[] = [
  {
    id: 'storm-2026-04-17T10:00',
    type: 'STORM',
    severity: 'HIGH',
    title: 'Storm risk detected',
    description: 'Thunderstorm conditions are expected in the next 24 hours.',
    validFrom: '2026-04-17T10:00',
    validUntil: '2026-04-18T10:00',
  },
  {
    id: 'strong_wind-2026-04-17T10:00',
    type: 'STRONG_WIND',
    severity: 'MEDIUM',
    title: 'Strong wind warning',
    description: 'Wind speed may exceed safe outdoor thresholds.',
    validFrom: '2026-04-17T10:00',
    validUntil: '2026-04-18T10:00',
  },
]
