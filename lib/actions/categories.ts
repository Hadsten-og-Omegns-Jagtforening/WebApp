'use server'

import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

const FALLBACK_CATEGORIES = ['Nyhed', 'Jagt', 'Præmieskydning', 'Klubaften', 'Praktisk info']

async function requireAuthenticatedUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/admin')
  return user
}

export async function listNewsCategories(): Promise<string[]> {
  try {
    const db = createAdminClient()
    const { data, error } = await db
      .from('news_categories')
      .select('name')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    if (error) throw new Error(error.message)
    return (data ?? []).map((row: { name: string }) => row.name)
  } catch (error) {
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
      return { error: error.message }
    }

    return { category: data.name }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Kategorien kunne ikke oprettes.' }
  }
}
