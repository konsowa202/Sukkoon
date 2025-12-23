import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/jwt'

// Protected routes that require authentication
const protectedRoutes = ['/admin', '/doctor', '/patient']
const publicRoutes = ['/login', '/signup', '/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    const token = request.cookies.get('sukoon_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '')

    // If no token in cookie/header, allow client-side to handle it
    // Client-side auth will check localStorage and redirect if needed
    if (!token) {
      // Allow access - client-side auth will handle redirect if user not logged in
      return NextResponse.next()
    }

    const payload = verifyToken(token)
    if (!payload) {
      // In development, allow access even if token invalid (for Mock auth)
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.next()
      }
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Role-based access control (only if valid token)
    if (pathname.startsWith('/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (pathname.startsWith('/doctor') && payload.role !== 'doctor') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (pathname.startsWith('/patient') && payload.role !== 'patient') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
}

