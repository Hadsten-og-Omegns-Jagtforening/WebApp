import { headers } from 'next/headers'

function normalize(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

export function getConfiguredSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return normalize(process.env.NEXT_PUBLIC_SITE_URL)
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return 'http://localhost:3000'
}

export async function getRequestSiteUrl() {
  const headerStore = await headers()
  const origin = headerStore.get('origin')

  if (origin) {
    return normalize(origin)
  }

  const forwardedHost = headerStore.get('x-forwarded-host')
  const forwardedProto = headerStore.get('x-forwarded-proto') ?? 'https'

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`
  }

  const host = headerStore.get('host')
  if (host) {
    const protocol = host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https'
    return `${protocol}://${host}`
  }

  return getConfiguredSiteUrl()
}
