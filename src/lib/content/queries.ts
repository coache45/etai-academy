/**
 * Server-side data access for Academy content_items (video/tutorial/station).
 * Mirrors the conventions in lib/guides/queries.ts (admin client, plain reads).
 */
import { createAdminClient } from '@/lib/supabase/admin'
import type { ContentItem, Pillar, ContentFormat } from '@/types/content'

export async function fetchPublishedContent(
  opts: { pillar?: Pillar; format?: ContentFormat } = {}
): Promise<ContentItem[]> {
  const supabase = createAdminClient()

  let query = supabase
    .from('content_items')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (opts.pillar) query = query.eq('pillar', opts.pillar)
  if (opts.format) query = query.eq('format', opts.format)

  const { data, error } = await query
  if (error || !data) return []
  return data as unknown as ContentItem[]
}

export async function fetchContentBySlug(slug: string): Promise<ContentItem | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('content_items')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data as unknown as ContentItem
}
