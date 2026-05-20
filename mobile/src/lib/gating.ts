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
 * Premium research posts & premium courses are unlocked ONLY for the
 * PREMIUM plan — this matches the web app exactly, where research/classroom
 * compute `isPremium = user.plan === 'PREMIUM'` and lock everything else.
 */
export function canViewPremium(plan: Plan): boolean {
  return plan === 'PREMIUM'
}

export function isLocked(isPremium: boolean, plan: Plan): boolean {
  return isPremium && !canViewPremium(plan)
}

/**
 * Resource tiers: FREE for everyone, BASIC needs >= BASIC, PREMIUM needs a
 * paid plan above BASIC. Mirrors the web resources gating.
 */
export function canAccessResource(tier: ResourceTier, plan: Plan): boolean {
  if (tier === 'FREE') return true
  if (tier === 'BASIC') return planRank(plan) >= planRank('BASIC')
  return planRank(plan) >= planRank('ADVANCED')
}
