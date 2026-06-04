import { Platform } from 'react-native'
import type { Plan, ResourceTier } from '@/types'

/** Ascending access order — must match the web Plan enum order. */
export const PLAN_ORDER: Plan[] = [
  'FREE',
  'BASIC',
  'ADVANCED',
  'MASTERY',
  'PREMIUM',
  'MENTORSHIP',
]

export function planRank(plan: Plan | string | undefined | null): number {
  if (!plan) return 0
  const i = PLAN_ORDER.indexOf(plan as Plan)
  return i < 0 ? 0 : i
}

/**
 * Apple App Store compliance: iOS apps cannot access premium content paid
 * for outside the app (no IAP = no premium content). On iOS we return false
 * unconditionally so premium content is treated as locked. List screens
 * filter premium items out entirely via `IS_IOS_FREE_ONLY` below.
 *
 * On Android the original web rule applies — premium only unlocks for
 * the PREMIUM plan exactly.
 */
export const IS_IOS_FREE_ONLY = Platform.OS === 'ios'

export function canViewPremium(plan: Plan): boolean {
  if (IS_IOS_FREE_ONLY) return false
  return plan === 'PREMIUM'
}

export function isLocked(isPremium: boolean, plan: Plan): boolean {
  return isPremium && !canViewPremium(plan)
}

/**
 * Resource tiers: FREE for everyone, BASIC needs >= BASIC, PREMIUM needs a
 * paid plan above BASIC. On iOS only FREE tier is accessible.
 */
export function canAccessResource(tier: ResourceTier, plan: Plan): boolean {
  if (IS_IOS_FREE_ONLY) return tier === 'FREE'
  if (tier === 'FREE') return true
  if (tier === 'BASIC') return planRank(plan) >= planRank('BASIC')
  return planRank(plan) >= planRank('ADVANCED')
}
