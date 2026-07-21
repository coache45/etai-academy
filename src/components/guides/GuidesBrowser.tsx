'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { CATEGORY_CONFIG, DIFFICULTY_CONFIG } from '@/types/guides'
import type { GuideCategory, GuideDifficulty } from '@/types/guides'

/**
 * Client-side guide library browser: instant search, category chips with live
 * counts, and (in "All" view) guides organized into category sections instead
 * of one undifferentiated wall of cards. 132 lightweight rows — trivial to
 * filter in memory.
 */

export type LightGuide = {
  id: string
  title: string
  tagline: string
  emoji: string
  slug: string
  category: GuideCategory
  difficulty: GuideDifficulty
  chapterCount: number
}

function GuideCard({ guide }: { guide: LightGuide }) {
  const diff = DIFFICULTY_CONFIG[guide.difficulty]
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="hover-pop3d group flex flex-col rounded-2xl border border-[#1B2A4A]/8 bg-white p-6 shadow-sm hover:border-[#00B3ED]/40 hover:shadow-lg hover:shadow-[#00B3ED]/5"
    >
      <div className="mb-3 flex items-start justify-between">
        <span className="text-4xl transition-transform duration-200 group-hover:scale-110">{guide.emoji}</span>
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${diff.bg} ${diff.color}`}>
          {diff.label}
        </span>
      </div>
      <h3 className="text-lg font-bold text-[#1B2A4A] transition-colors group-hover:text-[#0A72D2]">
        {guide.title}
      </h3>
      <p className="mt-1 flex-1 text-sm text-[#1B2A4A]/50 line-clamp-2">{guide.tagline}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-[#1B2A4A]/30">
          {guide.chapterCount} {guide.chapterCount === 1 ? 'chapter' : 'chapters'}
        </span>
        <span className="text-xs font-semibold text-[#C9A84C] opacity-0 transition-opacity group-hover:opacity-100">
          Start learning &rarr;
        </span>
      </div>
    </Link>
  )
}

export default function GuidesBrowser({
  guides,
  initialCategory,
}: {
  guides: LightGuide[]
  initialCategory?: GuideCategory
}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<GuideCategory | 'all'>(initialCategory ?? 'all')

  const counts = useMemo(() => {
    const c = new Map<GuideCategory, number>()
    for (const g of guides) c.set(g.category, (c.get(g.category) ?? 0) + 1)
    return c
  }, [guides])

  // Categories that actually have guides, biggest sections first.
  const activeCategories = useMemo(
    () =>
      (Object.keys(CATEGORY_CONFIG) as GuideCategory[])
        .filter((k) => (counts.get(k) ?? 0) > 0)
        .sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0)),
    [counts]
  )

  const q = query.trim().toLowerCase()
  const filtered = useMemo(
    () =>
      guides.filter(
        (g) =>
          (category === 'all' || g.category === category) &&
          (!q || g.title.toLowerCase().includes(q) || g.tagline.toLowerCase().includes(q))
      ),
    [guides, category, q]
  )

  const grouped = category === 'all' && !q

  return (
    <div>
      {/* Search */}
      <div className="mx-auto mb-6 max-w-xl">
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#1B2A4A]/30">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${guides.length} lessons — "prompts", "sleep", "money"…`}
            className="w-full rounded-2xl border border-[#1B2A4A]/10 bg-white py-3.5 pl-11 pr-4 text-sm text-[#1B2A4A] shadow-sm outline-none transition-all placeholder:text-[#1B2A4A]/30 focus:border-[#00B3ED]/60 focus:shadow-[0_0_0_4px_rgba(0,179,237,0.1)]"
          />
        </div>
      </div>

      {/* Category chips with live counts */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setCategory('all')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            category === 'all'
              ? 'bg-[#1B2A4A] text-white shadow-md'
              : 'border border-[#1B2A4A]/10 bg-white text-[#1B2A4A]/60 hover:bg-[#1B2A4A]/5'
          }`}
        >
          All <span className="opacity-60">· {guides.length}</span>
        </button>
        {activeCategories.map((key) => {
          const cfg = CATEGORY_CONFIG[key]
          return (
            <button
              key={key}
              onClick={() => setCategory(category === key ? 'all' : key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                category === key
                  ? 'bg-[#1B2A4A] text-white shadow-md'
                  : 'border border-[#1B2A4A]/10 bg-white text-[#1B2A4A]/60 hover:bg-[#1B2A4A]/5'
              }`}
            >
              {cfg.emoji} {cfg.label} <span className="opacity-60">· {counts.get(key)}</span>
            </button>
          )
        })}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#1B2A4A]/10 bg-white/50 p-12 text-center">
          <span className="text-4xl">🔍</span>
          <h3 className="mt-3 text-lg font-bold text-[#1B2A4A]">Nothing matches yet</h3>
          <p className="mt-1 text-sm text-[#1B2A4A]/40">
            Try a different word, or clear the search to browse every lesson.
          </p>
        </div>
      ) : grouped ? (
        <div className="space-y-14">
          {activeCategories.map((key) => {
            const cfg = CATEGORY_CONFIG[key]
            const items = filtered.filter((g) => g.category === key)
            if (items.length === 0) return null
            return (
              <section key={key}>
                <div className="mb-5 flex items-baseline gap-3 border-b border-[#1B2A4A]/8 pb-3">
                  <span className="text-2xl">{cfg.emoji}</span>
                  <h2 className="text-2xl font-black text-[#1B2A4A]">{cfg.label}</h2>
                  <span className="rounded-full bg-[#00B3ED]/10 px-2.5 py-0.5 text-xs font-bold text-[#0A72D2]">
                    {items.length} {items.length === 1 ? 'lesson' : 'lessons'}
                  </span>
                  <button
                    onClick={() => setCategory(key)}
                    className="ml-auto text-xs font-semibold text-[#C9A84C] hover:underline"
                  >
                    Focus &rarr;
                  </button>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((g) => (
                    <GuideCard key={g.id} guide={g} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      ) : (
        <>
          <p className="mb-5 text-center text-sm text-[#1B2A4A]/40">
            {filtered.length} {filtered.length === 1 ? 'lesson' : 'lessons'}
            {q ? ` matching "${query.trim()}"` : ''}
            {category !== 'all' ? ` in ${CATEGORY_CONFIG[category].emoji} ${CATEGORY_CONFIG[category].label}` : ''}
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((g) => (
              <GuideCard key={g.id} guide={g} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
