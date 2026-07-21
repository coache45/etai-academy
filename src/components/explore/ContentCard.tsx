'use client'

import Link from 'next/link'
import TiltCard from '@/components/fx/TiltCard'
import { FORMAT_CONFIG } from '@/types/content'
import type { ContentItem } from '@/types/content'

/**
 * Explore card with the immersive pop-out treatment: pointer tilt + emoji
 * lifting off the card (translateZ inside preserve-3d). Content stays
 * semantic — the 3D is decorative.
 */
export default function ContentCard({ item }: { item: ContentItem }) {
  const fmt = FORMAT_CONFIG[item.format]
  return (
    <Link href={`/explore/${item.slug}`} className="group block">
      <TiltCard className="flex h-full flex-col rounded-2xl border border-[#1B2A4A]/8 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg hover:border-[#C9A84C]/30">
        <div className="mb-3 flex items-start justify-between">
          <span className="pop-3d text-4xl" aria-hidden="true">{item.emoji}</span>
          <span className="rounded-full bg-[#C9A84C]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#C9A84C]">
            {fmt.emoji} {fmt.label}
          </span>
        </div>
        <h3 className="text-lg font-bold text-[#1B2A4A] group-hover:text-[#C9A84C] transition-colors">
          {item.title}
        </h3>
        <p className="mt-1 flex-1 text-sm text-[#1B2A4A]/50 line-clamp-2">{item.summary}</p>
        <span className="mt-4 text-xs font-medium text-[#C9A84C] opacity-0 transition-opacity group-hover:opacity-100">
          Open &rarr;
        </span>
      </TiltCard>
    </Link>
  )
}
