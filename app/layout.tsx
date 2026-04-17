import type { Metadata } from 'next'
import './globals.css'
import { AppProviders } from '@/app/providers'
import { SiteHeader } from '@/app/components/SiteHeader'

export const metadata: Metadata = {
  title: 'Weather Portal',
  description: 'Weather portal powered by Open Meteo',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <SiteHeader />
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
