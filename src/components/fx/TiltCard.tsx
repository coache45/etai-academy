'use client'

import { useRef, type ReactNode, type PointerEvent } from 'react'

/**
 * Pointer-tracking 3D tilt (CSS transforms only — no canvas). Children with the
 * `pop-3d` class lift toward the viewer via translateZ. Fully inert when the
 * user prefers reduced motion or on touch/coarse pointers.
 */
export default function TiltCard({
  children,
  className = '',
  max = 8,
}: {
  children: ReactNode
  className?: string
  max?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  const inert = () =>
    typeof window === 'undefined' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    window.matchMedia('(pointer: coarse)').matches

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || inert()) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(800px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(4px)`
  }

  const onLeave = () => {
    const el = ref.current
    if (el) el.style.transform = ''
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`tilt-3d ${className}`}
    >
      {children}
    </div>
  )
}
