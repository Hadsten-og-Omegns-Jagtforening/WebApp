import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function safeNextPath(next: string | null) {
  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return '/admin'
  }

  return next
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const nextPath = safeNextPath(requestUrl.searchParams.get('next'))
  const errorDescription = requestUrl.searchParams.get('error_description')

  if (!code) {
    const destination = new URL('/auth/update-password', requestUrl.origin)
    destination.searchParams.set('error', errorDescription || 'Linket er ugyldigt eller udloeber.')
    return NextResponse.redirect(destination)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    const destination = new URL('/auth/update-password', requestUrl.origin)
    destination.searchParams.set('error', 'Linket er ugyldigt eller udloeber.')
    return NextResponse.redirect(destination)
  }

  return NextResponse.redirect(new URL(nextPath, requestUrl.origin))
}
