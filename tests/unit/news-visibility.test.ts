import { describe, expect, it } from 'vitest'
import { getAdminPostState, isVisiblePublishedPost } from '@/lib/news-visibility'

describe('news visibility', () => {
  it('hides future published posts from public listings', () => {
    expect(isVisiblePublishedPost('published', '2099-01-01T10:00:00.000Z')).toBe(false)
    expect(isVisiblePublishedPost('published', '2020-01-01T10:00:00.000Z')).toBe(true)
    expect(isVisiblePublishedPost('draft', '2020-01-01T10:00:00.000Z')).toBe(false)
  })

  it('labels future published posts as scheduled in admin', () => {
    expect(getAdminPostState('published', '2099-01-01T10:00:00.000Z')).toBe('scheduled')
    expect(getAdminPostState('published', '2020-01-01T10:00:00.000Z')).toBe('published')
    expect(getAdminPostState('draft', null)).toBe('draft')
  })
})
