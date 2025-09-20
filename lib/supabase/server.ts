import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { SupabaseClient } from '@supabase/supabase-js'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

// Cache for request-scoped client (cleared after each request)
let cachedClient: SupabaseClient | null = null
let cachedCookieStore: ReadonlyRequestCookies | null = null

type ReadonlyRequestCookies = {
  get(name: string): { value: string } | undefined
  set(cookie: { name: string; value: string } & Partial<ResponseCookie>): void
}

export async function createClient() {
  const cookieStore = await cookies()
  
  // Reuse client if cookies haven't changed (within same request)
  if (cachedClient && cachedCookieStore === cookieStore) {
    return cachedClient
  }

  cachedCookieStore = cookieStore
  cachedClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
  
  return cachedClient
}