'use server'

import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { getUserWithTimeout } from '@/lib/supabase/auth-timeout'

const FALLBACK_CATEGORIES = ['Nyhed', 'Jagt', 'Præmieskydning', 'Klubaften', 'Praktisk info']
const CATEGORY_LOAD_TIMEOUT_MS = 4_000

function isMissingCategoriesTable(error: unknown) {
  if (!error || typeof error !== 'object') return false
  const maybeError = error as { code?: string; message?: string }
  return maybeError.code === 'PGRST205'
    || maybeError.message?.includes("Could not find the table 'public.news_categories'")
    || maybeError.message?.includes("relation \"public.news_categories\" does not exist")
}

async function requireAuthenticatedUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await getUserWithTimeout(supabase)
  if (error || !user) redirect('/admin')
  return user
}

async function withCategoryLoadTimeout<T>(promise: PromiseLike<T>): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeout = setTimeout(() => {
      reject(new Error('Timed out while loading news categories'))
    }, CATEGORY_LOAD_TIMEOUT_MS)
  })

  try {
    return await Promise.race([promise, timeoutPromise])
  } finally {
    if (timeout) clearTimeout(timeout)
  }
}

export async function listNewsCategories(): Promise<string[]> {
  try {
    const db = createAdminClient()
    const { data, error } = await withCategoryLoadTimeout(
      db
        .from('news_categories')
        .select('name')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true })
    )

    if (error) {
      if (isMissingCategoriesTable(error)) return FALLBACK_CATEGORIES
      throw new Error(error.message)
    }
    return (data ?? []).map((row: { name: string }) => row.name)
  } catch (error) {
    if (isMissingCategoriesTable(error)) return FALLBACK_CATEGORIES
    console.error('[news_categories] Failed to load categories', error)
    return FALLBACK_CATEGORIES
  }
}

export async function createNewsCategory(name: string): Promise<{ category?: string; error?: string }> {
  await requireAuthenticatedUser()

  const trimmed = name.trim()
  if (!trimmed) return { error: 'Skriv et kategorinavn.' }

  try {
    const db = createAdminClient()
    const { data, error } = await db
      .from('news_categories')
      .insert({ name: trimmed })
      .select('name')
      .single()

    if (error) {
      if (error.code === '23505') return { error: 'Kategorien findes allerede.' }
      if (isMissingCategoriesTable(error)) {
        return { error: 'Kategoritabellen mangler i Supabase. Kør migration 0003_news_categories.sql først.' }
      }
      return { error: error.message }
    }

    return { category: data.name }
  } catch (error) {
    if (isMissingCategoriesTable(error)) {
      return { error: 'Kategoritabellen mangler i Supabase. Kør migration 0003_news_categories.sql først.' }
    }
    return { error: error instanceof Error ? error.message : 'Kategorien kunne ikke oprettes.' }
  }
}
