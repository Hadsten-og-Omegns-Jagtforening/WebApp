export const PRIZE_ACTIVITY_ICONS = [
  'trophy',
  'claypigeon',
  'crosshair',
  'calendar',
  'shotshell',
  'ticket',
  'tree-pine',
] as const

export type PrizeActivityIcon = typeof PRIZE_ACTIVITY_ICONS[number]

export function isPrizeActivityIcon(value: string): value is PrizeActivityIcon {
  return PRIZE_ACTIVITY_ICONS.includes(value as PrizeActivityIcon)
}
