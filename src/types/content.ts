/**
 * Academy Upgrade — content taxonomy (6 pillars + non-guide formats).
 * Guides stay in `eli5_guides` / `types/guides.ts`; this covers video/tutorial/station.
 */
import type { GuideCategory } from '@/types/guides'

export type Pillar =
  | 'learn_ai'
  | 'health_wellbeing'
  | 'lifestyle'
  | 'tools_tutorials'
  | 'learning_stations'
  | 'media'

export type ContentFormat = 'video' | 'tutorial' | 'station'

export type ContentDifficulty = 'beginner' | 'intermediate' | 'advanced'

export interface ContentItem {
  id: string
  pillar: Pillar
  format: ContentFormat
  slug: string
  title: string
  summary: string
  emoji: string
  tags: string[]
  url: string | null
  body: Record<string, unknown>
  difficulty: ContentDifficulty
  is_published: boolean
  wave: number
  created_at: string
  updated_at: string
}

export type ContentItemInsert = Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>
export type ContentItemUpdate = Partial<Omit<ContentItem, 'id' | 'created_at'>>

export const PILLAR_CONFIG: Record<Pillar, { label: string; emoji: string; blurb: string }> = {
  learn_ai:          { label: 'Learn AI',           emoji: '🤖', blurb: 'Understand AI in plain English.' },
  health_wellbeing:  { label: 'Health & Wellbeing', emoji: '❤️', blurb: 'Health, sleep, nutrition, mental health — explained simply.' },
  lifestyle:         { label: 'Lifestyle',          emoji: '🌱', blurb: 'AI for everyday life, relationships, and money.' },
  tools_tutorials:   { label: 'Tools & Tutorials',  emoji: '🛠️', blurb: 'Hands-on walkthroughs of the tools that help.' },
  learning_stations: { label: 'Learning Stations',  emoji: '🎯', blurb: 'Guided, step-by-step learning tracks.' },
  media:             { label: 'Media',              emoji: '🎙️', blurb: 'The O-Spot podcast and video broadcasts.' },
}

export const PILLARS = Object.keys(PILLAR_CONFIG) as Pillar[]

export const FORMAT_CONFIG: Record<ContentFormat, { label: string; emoji: string }> = {
  video:    { label: 'Video',    emoji: '🎬' },
  tutorial: { label: 'Tutorial', emoji: '📝' },
  station:  { label: 'Station',  emoji: '🎯' },
}

/**
 * Maps the existing 14 guide categories into the 6 pillars, so guides can
 * surface under a pillar with NO data migration.
 */
export const CATEGORY_TO_PILLAR: Record<GuideCategory, Pillar> = {
  general:       'learn_ai',
  ai_basics:     'learn_ai',
  tools:         'tools_tutorials',
  manufacturing: 'tools_tutorials',
  sleep:         'health_wellbeing',
  stress:        'health_wellbeing',
  nutrition:     'health_wellbeing',
  movement:      'health_wellbeing',
  cognition:     'health_wellbeing',
  health:        'health_wellbeing',
  guardian:      'lifestyle',
  couples:       'lifestyle',
  relationships: 'lifestyle',
  business:      'lifestyle',
}
