import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Deutsch Satzbildung',
  description: 'german-sentence-builder',
  generator: 'v0.dev',
  icons: {
    icon: '/letter-a.svg',
    apple: '/letter-a.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
