import Link from 'next/link'
import { fetchPublishedContent } from '@/lib/content/queries'
import ContentCard from '@/components/explore/ContentCard'
import { PILLAR_CONFIG, PILLARS } from '@/types/content'
import type { ContentItem, Pillar } from '@/types/content'

// Always render at request time against the live DB.
export const dynamic = 'force-dynamic'

export default async function ExplorePage() {
  const items = await fetchPublishedContent()

  const byPillar = Object.fromEntries(PILLARS.map((p) => [p, [] as ContentItem[]])) as Record<Pillar, ContentItem[]>
  for (const item of items) {
    if (byPillar[item.pillar]) byPillar[item.pillar].push(item)
  }

  return (
    <div className="min-h-screen bg-[#FBF8F1]">
      <header className="border-b border-[#1B2A4A]/5 bg-[#FBF8F1]">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#C9A84C]">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L14 6V14H2V6L8 2Z" fill="#1B2A4A" />
                </svg>
              </div>
              <span className="text-sm font-bold text-[#1B2A4A]">ET AI Academy</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/tutor"
                className="rounded-lg border border-[#C9A84C]/50 bg-[#C9A84C]/10 px-4 py-2 text-xs font-bold text-[#1B2A4A] transition-colors hover:bg-[#C9A84C]/20"
              >
                🤖 Ask Ada
              </Link>
              <Link
                href="/me"
                className="rounded-lg border border-[#1B2A4A]/15 px-4 py-2 text-xs font-semibold text-[#1B2A4A] transition-colors hover:bg-[#1B2A4A]/5"
              >
                My Progress
              </Link>
              <Link
                href="/guides"
                className="rounded-lg bg-[#1B2A4A] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1B2A4A]/90"
              >
                Guides
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-10 text-center">
          <span className="text-4xl">🧭</span>
          <h1 className="mt-3 text-3xl font-black text-[#1B2A4A] sm:text-4xl">Explore the Academy</h1>
          <p className="mt-2 text-lg text-[#1B2A4A]/50">
            All things AI &mdash; guides, tutorials, stations, and media, one pillar at a time
          </p>
        </div>

        <div className="space-y-12">
          {PILLARS.map((pillar) => {
            const config = PILLAR_CONFIG[pillar]
            const pillarItems = byPillar[pillar]
            return (
              <section key={pillar}>
                <div className="mb-4 flex items-baseline gap-3">
                  <span className="text-2xl">{config.emoji}</span>
                  <h2 className="text-2xl font-black text-[#1B2A4A]">{config.label}</h2>
                  <span className="text-sm text-[#1B2A4A]/40">{config.blurb}</span>
                </div>
                {pillarItems.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#1B2A4A]/10 bg-white/50 p-8 text-center text-sm text-[#1B2A4A]/40">
                    New content landing here soon.{' '}
                    <Link href="/guides" className="font-semibold text-[#C9A84C] hover:underline">
                      Browse guides
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {pillarItems.map((item) => (
                      <ContentCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </section>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-[#1B2A4A]/30">Want the full written library?</p>
          <Link
            href="/guides"
            className="mt-2 inline-block rounded-xl bg-[#C9A84C] px-6 py-3 text-sm font-bold text-[#1B2A4A] transition-colors hover:bg-[#d4b55a]"
          >
            Browse all ELI5 Guides
          </Link>
        </div>
      </main>

      <footer className="mt-10 border-t border-[#1B2A4A]/5 py-6 text-center">
        <p className="text-xs text-[#1B2A4A]/30">ET AI Academy &middot; Bringing AI Down to Earth</p>
      </footer>
    </div>
  )
}
