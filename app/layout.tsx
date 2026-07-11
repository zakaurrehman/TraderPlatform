import type { Metadata, Viewport } from 'next'
import { Inter, Sora } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Trade With Shaffy | Forex Trading Education & Smart Money Concepts',
  description: 'Learn forex trading, smart money concepts, gold trading strategies, and market analysis with Trade With Shaffy.',
  keywords: ['forex trading', 'crypto trading', 'stock market', 'smart money concepts', 'gold trading', 'forex signals', 'ICT trading', 'market analysis'],
  authors: [{ name: 'Shaffy' }],
  creator: 'Trade With Shaffy',
  publisher: 'Trade With Shaffy',
  alternates: {
    canonical: 'https://www.tradewithshaffy.com',
  },
  verification: {
    google: 'WH90VIARChqv8TQ9jcx73L7ehHyR7bzVfu_aMLikfdk',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.webp', type: 'image/webp' },
    ],
    shortcut: '/favicon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Trade With Shaffy | Forex Trading Education & Smart Money Concepts',
    description: 'Learn forex trading, smart money concepts, gold trading strategies, and market analysis with Trade With Shaffy.',
    url: 'https://www.tradewithshaffy.com',
    siteName: 'Trade With Shaffy',
    type: 'website',
    images: [{ url: 'https://www.tradewithshaffy.com/Trade%20with%20Shaffy%20Png.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trade With Shaffy | Forex Trading Education & Smart Money Concepts',
    description: 'Learn forex trading, smart money concepts, gold trading strategies, and market analysis with Trade With Shaffy.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  // iOS Smart App Banner — Safari shows a "View in App Store" banner to
  // visitors on iPhone, deep-linking to the live app listing.
  itunes: {
    appId: '6772309277',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Trade With Shaffy',
  url: 'https://www.tradewithshaffy.com/',
  logo: 'https://www.tradewithshaffy.com/Trade%20with%20Shaffy%20Png.png',
  sameAs: [
    'https://www.facebook.com/',
    'https://www.instagram.com/shafqatrafiquee',
    'https://www.youtube.com/',
    'https://twitter.com/',
  ],
  description: 'Trade With Shaffy provides forex trading education, smart money concepts, trading strategies, and market analysis.',
  founder: {
    '@type': 'Person',
    name: 'Shaffy',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0b0f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
