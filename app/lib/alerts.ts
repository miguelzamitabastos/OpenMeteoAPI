export const ALERT_THRESHOLDS = {
  STORM: { weathercode: [95, 96, 99] },
  HEAVY_RAIN: { precipitation_probability: 80, precipitation: 10 },
  STRONG_WIND: { windspeed_10m: 50 },
  EXTREME_UV: { uv_index: 8 },
  LOW_VISIBILITY: { visibility: 1000 },
  FROST: { temperature_2m: 2 },
} as const

export type TAlertType = keyof typeof ALERT_THRESHOLDS
export type TAlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH'

export interface TAlert {
  id: string
  type: TAlertType
  severity: TAlertSeverity
  title: string
  description: string
  validFrom: string
  validUntil: string
}

const ALERT_SEVERITY_ORDER: Record<TAlertSeverity, number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
}

export interface THourlyAlertInput {
  time: string[]
  temperature_2m: number[]
  precipitation_probability: number[]
  precipitation: number[]
  weathercode: number[]
  windspeed_10m: number[]
  visibility: number[]
  uv_index: number[]
}

function createAlert(type: TAlertType, validFrom: string, validUntil: string): TAlert {
  const metadata: Record<
    TAlertType,
    { title: string; description: string; severity: TAlertSeverity }
  > = {
    STORM: {
      title: 'Storm risk detected',
      description: 'Thunderstorm conditions are expected in the next 24 hours.',
      severity: 'HIGH',
    },
    HEAVY_RAIN: {
      title: 'Heavy rain expected',
      description: 'High precipitation probability with intense rainfall is expected.',
      severity: 'MEDIUM',
    },
    STRONG_WIND: {
      title: 'Strong wind warning',
      description: 'Wind speed may exceed safe outdoor thresholds.',
      severity: 'MEDIUM',
    },
    EXTREME_UV: {
      title: 'Extreme UV index',
      description: 'UV index may reach harmful levels. Protection is recommended.',
      severity: 'MEDIUM',
    },
    LOW_VISIBILITY: {
      title: 'Low visibility conditions',
      description: 'Visibility may drop below safe driving levels.',
      severity: 'LOW',
    },
    FROST: {
      title: 'Frost conditions expected',
      description: 'Temperature may drop to frost levels.',
      severity: 'LOW',
    },
  }

  const info = metadata[type]
  return {
    id: `${type.toLowerCase()}-${validFrom}`,
    type,
    severity: info.severity,
    title: info.title,
    description: info.description,
    validFrom,
    validUntil,
  }
}

export function deriveAlerts(hourly: THourlyAlertInput): TAlert[] {
  const alerts: TAlert[] = []
  const { time } = hourly

  if (time.length === 0) {
    return alerts
  }

  const start = time[0]
  const end = time[time.length - 1]

  const hasStorm = hourly.weathercode.some((code: number): boolean =>
    ALERT_THRESHOLDS.STORM.weathercode.includes(code as 95 | 96 | 99),
  )
  if (hasStorm) {
    alerts.push(createAlert('STORM', start, end))
  }

  const hasHeavyRain = hourly.precipitation_probability.some((probability: number, index: number): boolean => {
    return (
      probability >= ALERT_THRESHOLDS.HEAVY_RAIN.precipitation_probability &&
      (hourly.precipitation[index] ?? 0) >= ALERT_THRESHOLDS.HEAVY_RAIN.precipitation
    )
  })
  if (hasHeavyRain) {
    alerts.push(createAlert('HEAVY_RAIN', start, end))
  }

  const hasStrongWind = hourly.windspeed_10m.some(
    (wind: number): boolean => wind >= ALERT_THRESHOLDS.STRONG_WIND.windspeed_10m,
  )
  if (hasStrongWind) {
    alerts.push(createAlert('STRONG_WIND', start, end))
  }

  const hasExtremeUv = hourly.uv_index.some(
    (uv: number): boolean => uv >= ALERT_THRESHOLDS.EXTREME_UV.uv_index,
  )
  if (hasExtremeUv) {
    alerts.push(createAlert('EXTREME_UV', start, end))
  }

  const hasLowVisibility = hourly.visibility.some(
    (visibility: number): boolean => visibility < ALERT_THRESHOLDS.LOW_VISIBILITY.visibility,
  )
  if (hasLowVisibility) {
    alerts.push(createAlert('LOW_VISIBILITY', start, end))
  }

  const hasFrost = hourly.temperature_2m.some(
    (temp: number): boolean => temp <= ALERT_THRESHOLDS.FROST.temperature_2m,
  )
  if (hasFrost) {
    alerts.push(createAlert('FROST', start, end))
  }

  return alerts.sort((left: TAlert, right: TAlert): number => {
    return ALERT_SEVERITY_ORDER[left.severity] - ALERT_SEVERITY_ORDER[right.severity]
  })
}