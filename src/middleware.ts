import { NextRequest, NextResponse } from 'next/server'
import { getAuthToken, verifyTokenForMiddleware } from '@/lib/auth'

// List of routes that don't require authentication
const publicRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/auth/me',
  '/api/health',
  '/api/test-rag',
  '/api/debug-ollama',
  '/api/knowledge/seed',
  '/login', // Login page
  '/register', // Register page
]


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log('🔥 Middleware executed for:', pathname)
  console.log('🍪 Available cookies:', request.cookies.getAll())

  // Special case: root route is public
  if (pathname === '/') {
    return NextResponse.next()
  }

  // Check if the route is explicitly public
  const isPublicRoute = publicRoutes.some(route =>
    pathname.startsWith(route)
  )

  console.log('🔍 Checking route:', pathname)
  console.log('📋 Is public route:', isPublicRoute)

  // If it's a public route, continue
  if (isPublicRoute) {
    console.log('✅ Route is public, allowing access')
    return NextResponse.next()
  }

  // All other routes are protected by default
  console.log('🔒 Route is protected, checking authentication')
  // Check authentication
  const token = getAuthToken(request)

  console.log('🍪 Token found:', !!token)

  if (!token) {
    console.log('❌ No token found for protected route:', pathname)
    // Redirect to login page
    const loginUrl = new URL('/login', request.url)
    console.log('🔄 Redirecting to:', loginUrl.toString())
    return NextResponse.redirect(loginUrl)
  }

  try {
    console.log('🔍 Validating token in middleware...')
    const payload = await verifyTokenForMiddleware(token)
    console.log('✅ Token validated, payload:', payload?.email || 'null')

    if (!payload) {
      console.log('❌ Invalid token')
      // Redirect to login page
      const loginUrl = new URL('/login', request.url)
      console.log('🔄 Redirecting to:', loginUrl.toString())
      return NextResponse.redirect(loginUrl)
    }

    console.log('✅ Authentication successful for:', payload.email)
  } catch (error) {
    console.error('❌ Middleware authentication error:', error)
    // Redirect to login page on error
    const loginUrl = new URL('/login', request.url)
    console.log('🔄 Redirecting to:', loginUrl.toString())
    return NextResponse.redirect(loginUrl)
  }

  // Continue to the requested route
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
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}