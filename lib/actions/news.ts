'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { validatePostInput } from '@/lib/news-validation'
import { sanitizeBody } from '@/lib/sanitize'
import { generateSlug } from '@/lib/slug'
import { normalizeResults } from '@/lib/results'
import type { NewsCategory, NewsPostInsert } from '@/lib/database.types'

function safeParseResults(value: FormDataEntryValue | null) {
  if (!value) return null
  try {
    return JSON.parse(value as string)
  } catch {
    return null
  }
}

function parsePublishedAt(value: FormDataEntryValue | null) {
  if (!value || typeof value !== 'string') return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function revalidateNewsPaths(slug?: string) {
  revalidatePath('/admin')
  revalidatePath('/admin/nyheder')
  revalidatePath('/admin/kalender')
  revalidatePath('/admin/premieskydninger')
  revalidatePath('/')
  revalidatePath('/nyheder')
  if (slug) revalidatePath(`/nyheder/${slug}`)
}

async function getAuthenticatedUserId(): Promise<string> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/admin')
  return user.id
}

export async function createPost(formData: FormData) {
  const userId = await getAuthenticatedUserId()
  const db = createAdminClient()

  const title = formData.get('title') as string
  const teaser = formData.get('teaser') as string
  const category = formData.get('category') as string
  const body = sanitizeBody(formData.get('body') as string)
  const validationError = validatePostInput({ title, teaser, category, body })
  if (validationError) return { error: validationError }
  const slug = generateSlug(title)
  const shouldPublish = formData.get('publish') === 'true'
  const selectedPublishedAt = parsePublishedAt(formData.get('published_at'))

  const post: NewsPostInsert = {
    slug,
    title,
    category: category as NewsCategory,
    teaser,
    body,
    image_url: (formData.get('image_url') as string) || null,
    has_results: formData.get('has_results') === 'true',
    results: normalizeResults(safeParseResults(formData.get('results'))),
    status: shouldPublish ? 'published' : 'draft',
    highlighted: formData.get('highlighted') === 'true',
    allow_comments: false,
    published_at: shouldPublish ? selectedPublishedAt ?? new Date().toISOString() : selectedPublishedAt,
    created_by: userId,
  }

  const { data, error } = await db.from('news').insert(post).select('id').single()
  if (error) return { error: error.message }

  revalidateNewsPaths()
  redirect(`/admin/nyheder/${data.id}`)
}

export async function updatePost(id: string, formData: FormData, slug?: string) {
  await getAuthenticatedUserId()
  const db = createAdminClient()

  const title = formData.get('title') as string
  const teaser = formData.get('teaser') as string
  const category = formData.get('category') as string
  const body = sanitizeBody(formData.get('body') as string)
  const validationError = validatePostInput({ title, teaser, category, body })
  if (validationError) return { error: validationError }

  const { error } = await db.from('news').update({
    title,
    category: category as NewsCategory,
    teaser,
    body,
    image_url: (formData.get('image_url') as string) || null,
    has_results: formData.get('has_results') === 'true',
    results: normalizeResults(safeParseResults(formData.get('results'))),
    highlighted: formData.get('highlighted') === 'true',
    published_at: parsePublishedAt(formData.get('published_at')),
  }).eq('id', id)

  if (error) return { error: error.message }

  revalidateNewsPaths(slug)
  return { success: true }
}

export async function publishPost(id: string, publishedAt: string | null, slug?: string) {
  await getAuthenticatedUserId()
  const db = createAdminClient()

  const { error } = await db.from('news').update({
    status: 'published',
    published_at: parsePublishedAt(publishedAt) ?? new Date().toISOString(),
  }).eq('id', id)

  if (error) return { error: error.message }

  revalidateNewsPaths(slug)
  return { success: true }
}

export async function saveDraft(id: string, formData: FormData) {
  await getAuthenticatedUserId()
  const db = createAdminClient()

  const title = formData.get('title') as string
  const teaser = formData.get('teaser') as string
  const category = formData.get('category') as string
  const body = sanitizeBody(formData.get('body') as string)
  const validationError = validatePostInput({ title, teaser, category, body })
  if (validationError) return { error: validationError }

  const { error } = await db.from('news').update({
    title,
    category: category as NewsCategory,
    teaser,
    body,
    image_url: (formData.get('image_url') as string) || null,
    has_results: formData.get('has_results') === 'true',
    results: normalizeResults(safeParseResults(formData.get('results'))),
    highlighted: formData.get('highlighted') === 'true',
    published_at: parsePublishedAt(formData.get('published_at')),
    status: 'draft',
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidateNewsPaths()
  return { success: true }
}

export async function deletePost(id: string) {
  await getAuthenticatedUserId()
  const db = createAdminClient()

  const { error } = await db.from('news').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidateNewsPaths()
  redirect('/admin/nyheder')
}
