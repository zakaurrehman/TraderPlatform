import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Trade with Shafy — Professional Forex Education & Signals',
  description: 'Learn Forex trading, get live signals, and join a community of profitable traders.',
  verification: {
    google: 'WH90VIARChqv8TQ9jcx73L7ehHyR7bzVfu_aMLikfdk',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
