import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Only check auth on protected routes
  const path = request.nextUrl.pathname
  
  const protectedPaths = ['/dashboard', '/composer', '/calendar', '/analytics', '/platforms', '/team', '/settings']
  const isProtectedPath = protectedPaths.some(p => path.startsWith(p))
  
  const authPaths = ['/login', '/register'] 
  const isAuthPath = authPaths.some(p => path.startsWith(p))
  
  // Skip middleware for non-protected routes
  if (!isProtectedPath && !isAuthPath) {
    return NextResponse.next()
  }
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to login if accessing protected route without auth
  if (isProtectedPath && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to dashboard if accessing auth routes while logged in
  if (isAuthPath && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    // Only run middleware on specific routes that need auth
    '/dashboard/:path*',
    '/composer/:path*',
    '/calendar/:path*',
    '/analytics/:path*',
    '/platforms/:path*',
    '/team/:path*',
    '/settings/:path*',
    '/profile/:path*',
    '/bio/:path*',
    '/templates/:path*',
    '/queue/:path*',
    '/login',
    '/register',
  ],
}