import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
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
  const tokenHash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null
  const nextPath = safeNextPath(requestUrl.searchParams.get('next'))
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Accept both link styles, so invite and recovery work the same way:
  //  - PKCE: ?code=...        (hosted /auth/v1/verify redirects here with a code)
  //  - OTP:  ?token_hash=&type=...  (custom email templates, any EmailOtpType)
  // No `type` is filtered out — invite, recovery, email, … all pass through.
  if (!code && !(tokenHash && type)) {
    const destination = new URL('/auth/update-password', requestUrl.origin)
    destination.searchParams.set('error', errorDescription || 'Linket er ugyldigt eller udloeber.')
    return NextResponse.redirect(destination)
  }

  const supabase = await createClient()
  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : await supabase.auth.verifyOtp({ type: type as EmailOtpType, token_hash: tokenHash as string })

  if (error) {
    const destination = new URL('/auth/update-password', requestUrl.origin)
    destination.searchParams.set('error', 'Linket er ugyldigt eller udloeber.')
    return NextResponse.redirect(destination)
  }

  return NextResponse.redirect(new URL(nextPath, requestUrl.origin))
}
