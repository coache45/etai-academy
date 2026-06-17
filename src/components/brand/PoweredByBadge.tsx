// PoweredByBadge.tsx — ET AI · The AI Academy
// "Powered by Extraterrestrial AI" badge.
//
// Principles:
// - ELI-5 label: plain words anyone can read on first glance. No jargon.
// - Brand: ET AI — Navy #1B2A4A / Gold #C9A84C, "Bringing AI Down to Earth."
// - Server component (zero client JS); hover handled by Tailwind only.
// - Background-agnostic: solid navy pill reads cleanly on light or dark pages.
// - Upgrade path: shaped so it can later swap for an Aethelgard *trust-badge
//   embed* (kernel src/lib/badge) WITHOUT changing how pages use it. When that
//   lands, pass `verifyHref` pointing at the kernel's trust certificate for
//   product_id "et-ai-academy". Until then it is a static, public-safe brand
//   badge — no secrets, no kernel calls.

import Link from 'next/link'

type PoweredByBadgeProps = {
  /** Where the badge links. Defaults to the ET AI universe. */
  href?: string
  /** Future: Aethelgard trust-certificate URL (product_id "et-ai-academy"). Overrides href when set. */
  verifyHref?: string
  className?: string
}

export default function PoweredByBadge({
  href = 'https://etaiworld.ai',
  verifyHref,
  className = '',
}: PoweredByBadgeProps) {
  const target = verifyHref ?? href
  return (
    <Link
      href={target}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Powered by Extraterrestrial AI — ET AI"
      className={
        'group inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 ' +
        'bg-[#1B2A4A] px-3 py-1.5 text-xs font-medium tracking-wide text-white/85 ' +
        'shadow-sm transition-colors hover:border-[#C9A84C]/70 hover:text-white ' +
        className
      }
    >
      <OrbitMark className="h-3.5 w-3.5 shrink-0 text-[#C9A84C]" />
      <span>
        Powered by <span className="font-semibold">Extraterrestrial AI</span>
      </span>
    </Link>
  )
}

/** Original ET AI orbit mark: a small planet with a ring. Drawn from scratch — not derived from any third-party logo. */
function OrbitMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.9" />
      <ellipse
        cx="12"
        cy="12"
        rx="10.5"
        ry="4.2"
        stroke="currentColor"
        strokeWidth="1.4"
        transform="rotate(-22 12 12)"
        opacity="0.85"
      />
    </svg>
  )
}
