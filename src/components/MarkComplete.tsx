'use client'

import { useState } from 'react'

type State = 'idle' | 'loading' | 'done' | 'auth' | 'error'

export function MarkComplete({
  itemType,
  itemSlug,
}: {
  itemType: 'guide' | 'content'
  itemSlug: string
}) {
  const [state, setState] = useState<State>('idle')

  async function mark() {
    setState('loading')
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_type: itemType, item_slug: itemSlug }),
      })
      if (res.status === 401) return setState('auth')
      if (!res.ok) return setState('error')
      setState('done')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-5 py-2.5 text-sm font-bold text-emerald-700">
        ✓ Completed — added to your Ladder
      </span>
    )
  }

  if (state === 'auth') {
    return (
      <a
        href="/login"
        className="inline-flex items-center gap-2 rounded-xl bg-[#1B2A4A] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1B2A4A]/90"
      >
        Sign in to track your progress
      </a>
    )
  }

  return (
    <button
      onClick={mark}
      disabled={state === 'loading'}
      className="inline-flex items-center gap-2 rounded-xl bg-[#C9A84C] px-6 py-2.5 text-sm font-bold text-[#1B2A4A] transition-colors hover:bg-[#d4b55a] disabled:opacity-60"
    >
      {state === 'loading' ? 'Saving…' : 'Mark as complete'}
      {state === 'error' && <span className="text-xs font-normal">— try again</span>}
    </button>
  )
}
