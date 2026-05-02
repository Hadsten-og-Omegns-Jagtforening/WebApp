'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getRequestSiteUrl } from '@/lib/site-url'

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Forkert e-mail eller adgangskode.' }
  }

  redirect('/admin')
}

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get('email') as string
  const supabase = await createClient()
  const siteUrl = await getRequestSiteUrl()
  const redirectTo = `${siteUrl}/auth/callback?next=/auth/update-password`

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

  if (error) {
    return { error: 'Kunne ikke sende nulstillingsmail. Kontroller e-mailadressen og proev igen.' }
  }

  return { success: 'Hvis e-mailadressen findes som admin-bruger, er der sendt et nulstillingslink.' }
}

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || password.length < 8) {
    return { error: 'Adgangskoden skal vaere mindst 8 tegn.' }
  }

  if (password !== confirmPassword) {
    return { error: 'Adgangskoderne matcher ikke.' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Linket er ugyldigt eller udloeber. Bed om et nyt nulstillingslink.' }
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: 'Kunne ikke opdatere adgangskoden. Bed om et nyt nulstillingslink.' }
  }

  redirect('/')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin')
}
