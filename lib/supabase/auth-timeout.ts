import type { User } from '@supabase/supabase-js'

type GetUserResult = {
  data: { user: User | null }
  error: Error | null
}

type SupabaseAuthClient = {
  auth: {
    getUser: () => Promise<GetUserResult>
  }
}

export async function getUserWithTimeout(
  supabase: SupabaseAuthClient,
  timeoutMs = 8_000
): Promise<GetUserResult> {
  let timeout: ReturnType<typeof setTimeout> | undefined

  const timeoutResult = new Promise<GetUserResult>((resolve) => {
    timeout = setTimeout(() => {
      resolve({
        data: { user: null },
        error: new Error('Supabase auth request timed out'),
      })
    }, timeoutMs)
  })

  try {
    return await Promise.race([supabase.auth.getUser(), timeoutResult])
  } finally {
    if (timeout) clearTimeout(timeout)
  }
}
