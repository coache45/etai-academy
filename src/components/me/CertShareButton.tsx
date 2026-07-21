'use client'

import { toast } from 'sonner'

/**
 * "Share as certificate" — mints (or reuses) a public certificate for one of
 * the user's own badges and copies the link. Rendered only for accounts with
 * the certificates entitlement (Pro perk), so it has zero footprint until Pro
 * launches.
 */
export default function CertShareButton({ credentialId }: { credentialId: string }) {
  const mint = async () => {
    try {
      const res = await fetch('/api/certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credentialId }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error ?? 'Could not create the certificate.')
        return
      }
      const url = `${window.location.origin}${data.url}`
      await navigator.clipboard.writeText(url)
      toast.success('Certificate link copied — share it anywhere!')
    } catch {
      toast.error('Could not create the certificate.')
    }
  }

  return (
    <button
      type="button"
      onClick={mint}
      className="ml-1 text-[11px] font-semibold text-[#C9A84C]/80 transition-colors hover:text-[#C9A84C] hover:underline"
    >
      Certificate &rarr;
    </button>
  )
}
