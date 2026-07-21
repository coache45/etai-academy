'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// WebGL loads only in the browser, only when this component decides to show it.
const HoloCanvas = dynamic(() => import('./HoloCanvas'), { ssr: false, loading: () => null })

/**
 * Decorative hero layer: the holographic knot + a GSAP ScrollTrigger scrub that
 * drifts/fades it as you scroll into the content. Renders NOTHING under
 * prefers-reduced-motion or below lg screens (mobile pays zero cost).
 * aria-hidden + pointer-events-none: purely visual, content stays semantic.
 */
export default function ImmersiveHero() {
  const wrap = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const wide = window.matchMedia('(min-width: 1024px)').matches
    setShow(!reduced && wide)
  }, [])

  useEffect(() => {
    if (!show || !wrap.current) return
    gsap.registerPlugin(ScrollTrigger)
    const tween = gsap.to(wrap.current, {
      yPercent: 30,
      scale: 0.8,
      opacity: 0.2,
      rotate: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: '55% top',
        scrub: 0.6,
      },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [show])

  if (!show) return null

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className="pointer-events-none absolute right-[-30px] top-[-20px] hidden lg:block"
      style={{ width: 380, height: 380 }}
    >
      <HoloCanvas />
    </div>
  )
}
