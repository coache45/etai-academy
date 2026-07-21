import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import Link from 'next/link'
import PoweredByBadge from '@/components/brand/PoweredByBadge'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ET AI Academy — Bringing AI Down to Earth',
  description: 'Free ELI5 guides, AI tools, and a community that speaks plain English. Learn anything. Understand everything.',
  keywords: ['AI', 'learning', 'ELI5', 'health', 'wellness', 'language learning', 'ET AI', 'Academy'],
  authors: [{ name: 'ET AI, LLC' }],
  openGraph: {
    title: 'ET AI Academy',
    description: 'Bringing AI Down to Earth — one lesson at a time.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <footer className="flex flex-col items-center gap-2 py-6">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#C9A84C]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#C9A84C]">
              Beta
            </span>
            <Link
              href="/trust"
              className="text-xs font-medium text-[#1B2A4A]/40 transition-colors hover:text-[#1B2A4A]/70 hover:underline"
            >
              Trust &amp; Privacy
            </Link>
          </div>
          <PoweredByBadge />
        </footer>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1B2A4A',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />
      </body>
    </html>
  )
}
