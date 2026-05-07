'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

async function assertAuthenticated() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/admin')
}

export async function updatePremie(id: string, formData: FormData) {
  await assertAuthenticated()
  const db = createAdminClient()

  const title = (formData.get('title') as string).trim()
  const month_label = (formData.get('month_label') as string).trim()
  const icon = (formData.get('icon') as string).trim()
  const description = (formData.get('description') as string).trim()
  const reglement = (formData.get('reglement') as string).trim()
  const sort_order = parseInt(formData.get('sort_order') as string, 10) || 0

  if (!title || !month_label) return { error: 'Titel og periode er påkrævet' }

  const { error } = await db
    .from('premieskydninger')
    .update({ title, month_label, icon, description, reglement, sort_order, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/premieskydninger')
  revalidatePath('/aktiviteter/premieskydninger')
  return { success: true }
}
