'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// WebGL loads only in the browser, only when this component decides to show it.
const HoloCanvas = dynamic(() => import('./HoloCanvas'), { ssr: false, loading: () => null })

/**
 * Contained hero hologram column (NOT an overlay — it lives in its own grid
 * column so it can never cover the headline). Shows the WebGL circuit-Earth on
 * capable desktop browsers; a static CSS glow-orb fallback under reduced
 * motion; nothing below lg (mobile pays zero WebGL cost — the hero's CSS
 * starfield carries the look there). GSAP adds a subtle scroll drift.
 */
export default function ImmersiveHero() {
  const wrap = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<'webgl' | 'static' | 'hidden'>('hidden')

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const wide = window.matchMedia('(min-width: 1024px)').matches
    if (!wide) setMode('hidden')
    else if (reduced) setMode('static')
    else setMode('webgl')
  }, [])

  useEffect(() => {
    if (mode !== 'webgl' || !wrap.current) return
    gsap.registerPlugin(ScrollTrigger)
    const tween = gsap.to(wrap.current, {
      yPercent: 14,
      opacity: 0.5,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: '45% top',
        scrub: 0.6,
      },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [mode])

  if (mode === 'hidden') return null

  if (mode === 'static') {
    return (
      <div aria-hidden="true" className="pointer-events-none relative h-full w-full">
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(0,179,237,0.35) 0%, rgba(10,114,210,0.15) 45%, transparent 70%)',
            boxShadow: '0 0 120px 30px rgba(0,179,237,0.12)',
          }}
        />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl">🌍</span>
      </div>
    )
  }

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className="pointer-events-none h-full w-full"
      style={{
        // Soft radial fade so the canvas edges melt into the starfield.
        maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 55%, transparent 82%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 55%, transparent 82%)',
      }}
    >
      <HoloCanvas />
    </div>
  )
}
