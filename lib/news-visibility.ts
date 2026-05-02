import type { NewsStatus } from './database.types'

export type AdminPostState = 'draft' | 'scheduled' | 'published'

export function isVisiblePublishedPost(status: NewsStatus, publishedAt: string | null, now = new Date()): boolean {
  if (status !== 'published' || !publishedAt) return false
  return new Date(publishedAt).getTime() <= now.getTime()
}

export function getAdminPostState(status: NewsStatus, publishedAt: string | null, now = new Date()): AdminPostState {
  if (status !== 'published') return 'draft'
  if (publishedAt && new Date(publishedAt).getTime() > now.getTime()) return 'scheduled'
  return 'published'
}

export function getPublishedCutoffIso(now = new Date()): string {
  return now.toISOString()
}
