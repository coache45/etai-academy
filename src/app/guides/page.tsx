import Link from 'next/link'
import { fetchPublishedGuides } from '@/lib/guides/queries'
import GuidesBrowser, { type LightGuide } from '@/components/guides/GuidesBrowser'
import { CATEGORY_CONFIG } from '@/types/guides'
import type { GuideCategory } from '@/types/guides'

interface PageProps {
  searchParams: { category?: string; tab?: string }
}

const CONTENT_TABS = [
  { key: 'guides', label: 'ELI5 Guides', emoji: '📖', href: '/guides', active: true },
  { key: 'explore', label: 'Explore', emoji: '🧭', href: '/explore', active: true },
  { key: 'podcast', label: 'The O-Spot', emoji: '🎙️', href: '/podcast', active: true },
  { key: 'ada', label: 'Ask Ada', emoji: '🤖', href: '/tutor', active: true },
]

export default async function AcademyPage({ searchParams }: PageProps) {
  const initialCategory =
    searchParams.category && searchParams.category in CATEGORY_CONFIG
      ? (searchParams.category as GuideCategory)
      : undefined

  const guides = await fetchPublishedGuides()
  const light: LightGuide[] = guides.map((g) => ({
    id: g.id,
    title: g.title,
    tagline: g.tagline,
    emoji: g.emoji,
    slug: g.slug,
    category: g.category,
    difficulty: g.difficulty,
    chapterCount: g.chapters.length,
  }))

  return (
    <div className="min-h-screen bg-[#FBF8F1]">
      {/* Header */}
      <header className="border-b border-[#1B2A4A]/5 bg-[#FBF8F1]">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[#F49E08] to-[#C9A84C]">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L14 6V14H2V6L8 2Z" fill="#061233" />
                </svg>
              </div>
              <span className="text-sm font-black tracking-tight">
                <span className="text-gold-gradient">ET</span>{' '}
                <span className="text-ai-gradient">AI</span>{' '}
                <span className="font-bold text-[#1B2A4A]">Academy</span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/tutor"
                className="rounded-lg border border-[#00B3ED]/40 bg-[#00B3ED]/10 px-4 py-2 text-xs font-bold text-[#0A72D2] transition-colors hover:bg-[#00B3ED]/20"
              >
                🤖 Ask Ada
              </Link>
              <Link
                href="/explore"
                className="rounded-lg bg-[#1B2A4A] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1B2A4A]/90"
              >
                Explore
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        {/* Hero */}
        <div className="mb-8 text-center">
          <span className="text-4xl">🎓</span>
          <h1 className="mt-3 text-3xl font-black text-[#1B2A4A] sm:text-4xl">
            The <span className="text-gold-gradient">ELI5</span>{' '}
            <span className="text-ai-gradient">Library</span>
          </h1>
          <p className="mt-2 text-lg text-[#1B2A4A]/50">
            {light.length}+ lessons, every one explained like you&apos;re five
          </p>
        </div>

        {/* Surface tabs */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          {CONTENT_TABS.map((tab) => (
            <Link
              key={tab.key}
              href={tab.href}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                tab.key === 'guides'
                  ? 'bg-[#1B2A4A] text-white shadow-lg shadow-[#1B2A4A]/20'
                  : 'border border-[#1B2A4A]/10 bg-white text-[#1B2A4A]/60 hover:bg-[#1B2A4A]/5'
              }`}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Library browser: search + category chips + grouped sections */}
        <GuidesBrowser guides={light} initialCategory={initialCategory} />

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-sm text-[#1B2A4A]/30">Want Ada to walk you through any of these?</p>
          <Link
            href="/signup"
            className="mt-2 inline-block rounded-xl bg-[#C9A84C] px-6 py-3 text-sm font-bold text-[#1B2A4A] transition-colors hover:bg-[#d4b55a]"
          >
            Join the Academy
          </Link>
        </div>
      </main>

      <footer className="mt-10 border-t border-[#1B2A4A]/5 py-6 text-center">
        <p className="text-xs text-[#1B2A4A]/30">ET AI Academy &middot; Bringing AI Down to Earth</p>
      </footer>
    </div>
  )
}
