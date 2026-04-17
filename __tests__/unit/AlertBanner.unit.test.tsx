import { fireEvent, render, screen } from '@testing-library/react'
import { AlertBanner } from '@/app/components/AlertBanner'
import type { TAlert } from '@/app/lib/alerts'

const alertsFixture: TAlert[] = [
  {
    id: 'storm-1',
    type: 'STORM',
    severity: 'HIGH',
    title: 'Storm risk detected',
    description: 'Thunderstorm conditions are expected.',
    validFrom: '2026-04-17T10:00:00Z',
    validUntil: '2026-04-17T20:00:00Z',
  },
]

describe('AlertBanner', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  })

  it('shows details when alert panel is expanded', () => {
    render(<AlertBanner alerts={alertsFixture} />)

    fireEvent.click(screen.getByRole('button', { name: /Toggle details for Storm risk detected/i }))

    expect(screen.getByText('Thunderstorm conditions are expected.')).toBeInTheDocument()
  })

  it('dismisses alert and shows empty state', () => {
    render(<AlertBanner alerts={alertsFixture} />)

    fireEvent.click(screen.getByRole('button', { name: /Dismiss Storm risk detected/i }))

    expect(screen.getByText('No active alerts')).toBeInTheDocument()
  })
})