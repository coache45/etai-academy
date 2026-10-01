/**
 * Chrome regression guard — the Academy is a sovereign app (2026-07-20).
 * Renders `/`, `/guides`, `/login` and the 404 page inside the root layout and checks the
 * page frame (brand, nav, footer, links) is Academy-only: no "ET AI ONE"
 * branding, no Dashboard nav, no links to the retired ONE Health routes.
 * ONE Health is a separate app; `/` may link OUT to it from the Ecosystem
 * card, and that is the only place the name is allowed.
 */
import { describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import type { ReactElement } from 'react'

// --- Boundary mocks: no network, no WebGL, no Next runtime -----------------
vi.mock('next/font/google', () => ({ Inter: () => ({ className: 'inter' }) }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))
vi.mock('@/lib/supabase/client', () => ({ createClient: () => ({ auth: {} }) }))
vi.mock('@/lib/guides/queries', () => ({
  fetchPublishedGuides: async () => [
    {
      id: 'g1',
      title: 'What is AI?',
      tagline: 'A computer that learns from examples.',
      emoji: '🤖',
      slug: 'what-is-ai',
      category: 'ai_basics',
      difficulty: 'beginner',
      chapters: [],
    },
  ],
}))
vi.mock('@/components/fx/ImmersiveHero', () => ({
  default: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}))
vi.mock('@/components/fx/Reveal', () => ({
  default: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}))
vi.mock('@/components/landing/AdaLandingDemo', () => ({ default: () => null }))

import RootLayout from '@/app/layout'
import HomePage from '@/app/page'
import GuidesPage from '@/app/guides/page'
import LoginPage from '@/app/(auth)/login/page'
import NotFound from '@/app/not-found'
import { buttonVariants } from '@/components/ui/button'

const OLD_PALETTE = /#F5C842|#1E6FBF|#F8F9FA/i

const ONE_HEALTH_APP = 'https://etai-one-health.vercel.app'

function render(page: ReactElement) {
  return renderToStaticMarkup(<RootLayout>{page}</RootLayout>)
}

/** Remove the one allowed outbound ONE Health link (an <a> to the separate app). */
function withoutOutboundOneHealthLink(html: string) {
  const escaped = ONE_HEALTH_APP.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return html.replace(new RegExp(`<a[^>]*href="${escaped}[^"]*"[\\s\\S]*?</a>`, 'g'), '')
}

const routes: Array<[string, () => Promise<string>]> = [
  ['/', async () => render(<HomePage />)],
  ['/guides', async () => render(await GuidesPage({ searchParams: {} }))],
  ['/login', async () => render(<LoginPage />)],
  ['/not-found', async () => render(<NotFound />)],
]

describe.each(routes)('%s chrome', (_route, renderRoute) => {
  it('shows the Academy brand and the Extraterrestrial AI footer', async () => {
    const html = await renderRoute()
    expect(html).toMatch(/ET AI(<\/span>\s*<span[^>]*>| )Academy/)
    expect(html).toContain('Extraterrestrial AI')
    expect(html).toContain('#1B2A4A')
    expect(html).toContain('#C9A84C')
  })

  it('has no ONE Health chrome', async () => {
    const html = withoutOutboundOneHealthLink(await renderRoute())
    expect(html).not.toMatch(/ET AI ONE/i)
    expect(html).not.toMatch(/ONE Health/i)
    expect(html).not.toMatch(/>\s*Dashboard\s*</i)
    expect(html).not.toMatch(/href="\/(dashboard|health|coach|studio|couples)(\/|")/)
    // Old ONE Health palette (gold #F5C842, signal blue #1E6FBF, gray #F8F9FA)
    expect(html).not.toMatch(OLD_PALETTE)
  })
})

describe('/ Ecosystem card', () => {
  it('links ONE Health out to its own app, never to an in-app route', async () => {
    const html = render(<HomePage />)
    expect(html).toContain(`href="${ONE_HEALTH_APP}"`)
  })
})

describe('Button variants', () => {
  it.each(['default', 'gold', 'outline', 'secondary', 'link'] as const)(
    '%s uses the Academy palette only',
    (variant) => {
      expect(buttonVariants({ variant })).not.toMatch(OLD_PALETTE)
    },
  )
})
