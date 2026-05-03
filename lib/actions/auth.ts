'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getConfiguredSiteUrl } from '@/lib/site-url'

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
  const redirectTo = `${getConfiguredSiteUrl()}/auth/callback?next=/auth/update-password`

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

  if (error) {
    console.error('[auth] resetPasswordForEmail error:', error.message)
    return { error: diagnosAuthError(error.message) }
  }

  return { success: 'Hvis e-mailadressen findes som admin-bruger, er der sendt et nulstillingslink.' }
}

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || password.length < 8) {
    return { error: 'Adgangskoden skal være mindst 8 tegn.' }
  }

  if (password !== confirmPassword) {
    return { error: 'Adgangskoderne matcher ikke.' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Linket er ugyldigt eller udløbet. Bed om et nyt nulstillingslink.' }
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    console.error('[auth] updateUser error:', error.message)
    return { error: 'Kunne ikke opdatere adgangskoden. Bed om et nyt nulstillingslink.' }
  }

  redirect('/admin')
}

export async function inviteUser(formData: FormData) {
  const email = (formData.get('email') as string).trim()

  if (!email) {
    return { error: 'E-mailadressen mangler.' }
  }

  const redirectTo = `${getConfiguredSiteUrl()}/auth/callback?next=/auth/update-password`

  const supabase = createAdminClient()
  const { error } = await supabase.auth.admin.inviteUserByEmail(email, { redirectTo })

  if (error) {
    console.error('[auth] inviteUserByEmail error:', error.message)
    const msg = error.message.toLowerCase()
    if (msg.includes('already') || msg.includes('registered')) {
      return { error: 'Denne e-mailadresse er allerede registreret.' }
    }
    return { error: diagnosAuthError(error.message) }
  }

  return { success: `Invitation sendt til ${email}.` }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

function diagnosAuthError(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('rate limit') || m.includes('too many')) {
    return 'E-mail rate limit overskredet. Supabase tillader kun 2 e-mails/time på gratis projekter. Konfigurer custom SMTP under Authentication → Settings i Supabase-dashboardet.'
  }
  if (m.includes('redirect') && (m.includes('not allowed') || m.includes('invalid'))) {
    return `Redirect-URL er ikke tilladt. Tilføj "${getConfiguredSiteUrl()}/**" under Authentication → URL Configuration → Redirect URLs i Supabase-dashboardet.`
  }
  if (m.includes('smtp') || m.includes('email') || m.includes('send')) {
    return 'E-mail kunne ikke sendes. Kontroller SMTP-konfigurationen i Supabase-dashboardet.'
  }
  return `Fejl fra Supabase: ${message}`
}
