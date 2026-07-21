import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * ACTIVE middleware (moved from the repo root, where Next.js never loaded it —
 * this app lives in src/, so only src/middleware.ts runs).
 *
 * Duties: refresh Supabase session cookies on every page view, redirect
 * unauthenticated users off private pages, and bounce signed-in users away
 * from /login and /signup.
 *
 * publicPaths audited 2026-07-21 against real behavior at main @ 9220b23 —
 * every route listed here was already publicly reachable. API routes are
 * excluded entirely via the matcher: every /api/* handler enforces its own
 * auth, caps, and moderation (see the route files).
 */
const publicPaths = [
  '/',
  '/login',
  '/signup',
  '/onboarding',
  '/guides',
  '/explore',
  '/podcast',
  '/trust',
  '/share',
  '/cert',
]

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const pathname = request.nextUrl.pathname

  const isPublic =
    publicPaths.some((p) => pathname === p || pathname.startsWith(p + '/')) ||
    pathname.startsWith('/auth/')

  if (!user && !isPublic) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  // Redirect logged-in users away from auth pages
  if (user && (pathname === '/login' || pathname === '/signup')) {
    const dashUrl = request.nextUrl.clone()
    dashUrl.pathname = '/guides'
    return NextResponse.redirect(dashUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Skip /api (routes self-protect), Next internals, and any file with an
    // extension (favicon.ico, robots.txt, images, fonts…).
    '/((?!api|_next|.*\\..*).*)',
  ],
}
