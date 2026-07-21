import Link from 'next/link'
import { fetchPublishedContent } from '@/lib/content/queries'
import { PILLAR_CONFIG, PILLARS, FORMAT_CONFIG } from '@/types/content'
import type { ContentItem, Pillar } from '@/types/content'

// Always render at request time against the live DB.
export const dynamic = 'force-dynamic'

function ContentCard({ item }: { item: ContentItem }) {
  const fmt = FORMAT_CONFIG[item.format]
  const inner = (
    <>
      <div className="mb-3 flex items-start justify-between">
        <span className="text-4xl">{item.emoji}</span>
        <span className="rounded-full bg-[#C9A84C]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#C9A84C]">
          {fmt.emoji} {fmt.label}
        </span>
      </div>
      <h3 className="text-lg font-bold text-[#1B2A4A]">{item.title}</h3>
      <p className="mt-1 flex-1 text-sm text-[#1B2A4A]/50 line-clamp-2">{item.summary}</p>
    </>
  )
  const base =
    'group flex flex-col rounded-2xl border border-[#1B2A4A]/8 bg-white p-6 shadow-sm transition-all'

  if (item.url) {
    return (
      <Link href={item.url} className={`${base} hover:shadow-md hover:border-[#C9A84C]/30 hover:-translate-y-0.5`}>
        {inner}
        <span className="mt-4 text-xs font-medium text-[#C9A84C] opacity-0 transition-opacity group-hover:opacity-100">
          Open &rarr;
        </span>
      </Link>
    )
  }
  return (
    <div className={base}>
      {inner}
      <span className="mt-4 text-xs font-medium text-[#1B2A4A]/30">Coming soon</span>
    </div>
  )
}

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
            <Link
              href="/guides"
              className="rounded-lg bg-[#1B2A4A] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1B2A4A]/90"
            >
              Guides
            </Link>
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
