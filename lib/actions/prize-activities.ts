'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { getUserWithTimeout } from '@/lib/supabase/auth-timeout'
import {
  FALLBACK_PRIZE_ACTIVITIES,
  parsePrizeActivityForm,
} from '@/lib/prize-activities'
import type { PrizeActivity } from '@/lib/database.types'

const PRIZE_ACTIVITY_QUERY_TIMEOUT_MS = 4_000

async function withPrizeActivityTimeout<T>(promise: PromiseLike<T>, message: string): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => reject(new Error(message)), PRIZE_ACTIVITY_QUERY_TIMEOUT_MS)
  })

  try {
    return await Promise.race([Promise.resolve(promise), timeoutPromise])
  } finally {
    if (timeout) clearTimeout(timeout)
  }
}

async function requireAuthenticatedUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await getUserWithTimeout(supabase)
  if (error || !user) redirect('/admin')
  return user
}

function revalidatePrizeActivityPaths(slug?: string) {
  revalidatePath('/admin/premieskydninger')
  revalidatePath('/aktiviteter/premieskydninger')
  if (slug) revalidatePath(`/aktiviteter/premieskydninger/${slug}`)
}

export async function listPrizeActivities(): Promise<{ activities: PrizeActivity[]; error?: string }> {
  try {
    const db = createAdminClient()
    const query = db
      .from('prize_activities')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('title', { ascending: true })
    const { data, error } = await withPrizeActivityTimeout(query, 'Timed out while loading prize activities')

    if (error) throw new Error(error.message)
    return { activities: (data as PrizeActivity[]) ?? [] }
  } catch (error) {
    console.error('[prize_activities] Failed to load activities', error)
    return {
      activities: FALLBACK_PRIZE_ACTIVITIES,
      error: error instanceof Error ? error.message : 'Ukendt serverfejl',
    }
  }
}

export async function listPublicPrizeActivities(): Promise<PrizeActivity[]> {
  try {
    const db = createAdminClient()
    const query = db
      .from('prize_activities')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('title', { ascending: true })
    const { data, error } = await withPrizeActivityTimeout(query, 'Timed out while loading public prize activities')

    if (error) throw new Error(error.message)
    return (data as PrizeActivity[]) ?? []
  } catch (error) {
    console.error('[prize_activities] Failed to load public activities', error)
    return FALLBACK_PRIZE_ACTIVITIES.filter(activity => activity.is_active)
  }
}

export async function getPrizeActivityBySlug(slug: string): Promise<PrizeActivity | null> {
  try {
    const db = createAdminClient()
    const query = db
      .from('prize_activities')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
    const { data, error } = await withPrizeActivityTimeout(query, 'Timed out while loading prize activity')

    if (error) throw new Error(error.message)
    return data as PrizeActivity
  } catch (error) {
    const fallback = FALLBACK_PRIZE_ACTIVITIES.find(activity => activity.slug === slug && activity.is_active)
    if (fallback) return fallback
    console.error('[prize_activities] Failed to load activity', error)
    return null
  }
}

export async function getPrizeActivityForAdmin(id: string): Promise<PrizeActivity | null> {
  try {
    const db = createAdminClient()
    const query = db
      .from('prize_activities')
      .select('*')
      .eq('id', id)
      .single()
    const { data, error } = await withPrizeActivityTimeout(query, 'Timed out while loading prize activity')

    if (error) return null
    return data as PrizeActivity
  } catch (error) {
    console.error('[prize_activities] Failed to load admin activity', error)
    return null
  }
}

export async function createPrizeActivity(formData: FormData) {
  await requireAuthenticatedUser()
  const parsed = parsePrizeActivityForm(formData)
  if (parsed.error || !parsed.data) return { error: parsed.error ?? 'Præmieskydningen kunne ikke gemmes.' }

  const db = createAdminClient()
  const { data, error } = await db
    .from('prize_activities')
    .insert(parsed.data)
    .select('id')
    .single()

  if (error) return { error: error.message }

  revalidatePrizeActivityPaths(parsed.data.slug)
  redirect(`/admin/premieskydninger/${data.id}`)
}

export async function updatePrizeActivity(id: string, previousSlug: string, formData: FormData) {
  await requireAuthenticatedUser()
  const parsed = parsePrizeActivityForm(formData)
  if (parsed.error || !parsed.data) return { error: parsed.error ?? 'Præmieskydningen kunne ikke gemmes.' }

  const db = createAdminClient()
  const { error } = await db
    .from('prize_activities')
    .update(parsed.data)
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePrizeActivityPaths(previousSlug)
  revalidatePrizeActivityPaths(parsed.data.slug)
  return { success: true }
}
