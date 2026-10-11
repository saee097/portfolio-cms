import type { Metadata, Viewport } from 'next'
import { Inter, Manrope } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'CodeSpare - Full Stack Developer',
    template: '%s | CodeSpare',
  },
  description: 'Full-stack developer portfolio showcasing projects, skills, and experience.',
  keywords: ['developer', 'portfolio', 'full-stack', 'React', 'Next.js', 'TypeScript'],
  authors: [{ name: 'CodeSpare' }],
  creator: 'CodeSpare',
  publisher: 'CodeSpare',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    siteName: 'CodeSpare',
    title: 'CodeSpare - Full Stack Developer',
    description: 'Full-stack developer portfolio showcasing projects, skills, and experience.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CodeSpare Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeSpare - Full Stack Developer',
    description: 'Full-stack developer portfolio showcasing projects, skills, and experience.',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true} data-scroll-behavior="smooth" className={`${inter.variable} ${manrope.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://your-supabase-project.supabase.co" />
      </head>
      <body suppressHydrationWarning={true} className="min-h-full flex flex-col bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}