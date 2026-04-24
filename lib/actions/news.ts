'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { sanitizeBody } from '@/lib/sanitize'
import { generateSlug } from '@/lib/slug'
import type { NewsCategory, NewsPostInsert } from '@/lib/database.types'

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
  const body = sanitizeBody(formData.get('body') as string)
  const slug = generateSlug(title)

  const post: NewsPostInsert = {
    slug,
    title,
    category: formData.get('category') as NewsCategory,
    teaser: formData.get('teaser') as string,
    body,
    image_url: (formData.get('image_url') as string) || null,
    has_results: formData.get('has_results') === 'true',
    results: formData.get('results')
      ? JSON.parse(formData.get('results') as string)
      : null,
    status: 'draft',
    highlighted: formData.get('highlighted') === 'true',
    allow_comments: false,
    published_at: null,
    created_by: userId,
  }

  const { data, error } = await db.from('news').insert(post).select('id').single()
  if (error) return { error: error.message }

  revalidatePath('/admin/nyheder')
  revalidatePath('/')
  redirect(`/admin/nyheder/${data.id}`)
}

export async function updatePost(id: string, formData: FormData) {
  await getAuthenticatedUserId()
  const db = createAdminClient()

  const title = formData.get('title') as string
  const body = sanitizeBody(formData.get('body') as string)

  const { error } = await db.from('news').update({
    title,
    slug: generateSlug(title),
    category: formData.get('category') as NewsCategory,
    teaser: formData.get('teaser') as string,
    body,
    image_url: (formData.get('image_url') as string) || null,
    has_results: formData.get('has_results') === 'true',
    results: formData.get('results')
      ? JSON.parse(formData.get('results') as string)
      : null,
    highlighted: formData.get('highlighted') === 'true',
  }).eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/nyheder')
  revalidatePath('/')
  revalidatePath(`/nyheder`)
  return { success: true }
}

export async function publishPost(id: string, publishedAt: string | null) {
  await getAuthenticatedUserId()
  const db = createAdminClient()

  const { error } = await db.from('news').update({
    status: 'published',
    published_at: publishedAt ?? new Date().toISOString(),
  }).eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/nyheder')
  revalidatePath('/')
  revalidatePath('/nyheder')
  return { success: true }
}

export async function saveDraft(id: string, formData: FormData) {
  await getAuthenticatedUserId()
  const db = createAdminClient()

  const title = formData.get('title') as string
  const body = sanitizeBody(formData.get('body') as string)

  const { error } = await db.from('news').update({
    title,
    slug: generateSlug(title),
    category: formData.get('category') as NewsCategory,
    teaser: formData.get('teaser') as string,
    body,
    image_url: (formData.get('image_url') as string) || null,
    has_results: formData.get('has_results') === 'true',
    results: formData.get('results')
      ? JSON.parse(formData.get('results') as string)
      : null,
    highlighted: formData.get('highlighted') === 'true',
    status: 'draft',
  }).eq('id', id)

  if (error) return { error: error.message }
  return { success: true }
}

export async function deletePost(id: string) {
  await getAuthenticatedUserId()
  const db = createAdminClient()

  const { error } = await db.from('news').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/nyheder')
  revalidatePath('/')
  revalidatePath('/nyheder')
  redirect('/admin/nyheder')
}
