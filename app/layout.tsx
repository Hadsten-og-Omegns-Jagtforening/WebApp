import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hadsten & Omegns Jagtforening',
  description: 'HOJ — flugtskydning, jagt og fællesskab siden 1968',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <body>{children}</body>
    </html>
  )
}
