/**
 * Entitlements — maps a user profile (tier + add-ons) to concrete capabilities.
 * Pure function, no DB. Gate every feature + the tutor cap against this, never raw tier strings.
 */
import type { Database } from '@/types/database.types'

type ProfileRow = Database['public']['Tables']['profiles']['Row']
type EntitlementProfile = Pick<
  ProfileRow,
  'subscription_tier' | 'subscription_status' | 'entitlements' | 'is_founder'
>

export const FREE_DAILY_TUTOR_CAP = 15
export const PRO_DAILY_TUTOR_CAP = 500 // effectively unlimited for beta; tune later
export const FOUNDER_CAP = 1000
export const PRO_PRICE = { monthly: 9, yearly: 79 } // Founder cohort (first 1000)

export type Entitlements = {
  tier: 'free' | 'pro'
  dailyTutorCap: number
  premiumTheme: boolean
  earlyAccess: boolean
  learningPaths: boolean
  voiceTutor: boolean
  certificates: boolean
  founder: boolean
}

export function getEntitlements(profile: EntitlementProfile | null): Entitlements {
  const isPro =
    !!profile && profile.subscription_tier === 'pro' && profile.subscription_status === 'active'
  const addons = ((profile?.entitlements as Record<string, boolean> | null) ?? {}) || {}

  const on = (key: string) => isPro || addons[key] === true

  return {
    tier: isPro ? 'pro' : 'free',
    dailyTutorCap: isPro ? PRO_DAILY_TUTOR_CAP : FREE_DAILY_TUTOR_CAP,
    premiumTheme: on('premiumTheme'),
    earlyAccess: on('earlyAccess'),
    learningPaths: on('learningPaths'),
    voiceTutor: on('voiceTutor'),
    certificates: on('certificates'),
    founder: profile?.is_founder === true,
  }
}
