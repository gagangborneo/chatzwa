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
  '/api/embed-chat', // Embed chat API for external websites
  '/api/admin/setup-appwrite', // Admin setup endpoint
  '/api/admin/create-user', // Admin user creation endpoint
  '/api/admin/create-user-simple', // Admin simple user creation endpoint
  '/api/admin/create-user-demo', // Admin demo user creation endpoint
  '/api/admin/list-users', // Admin list users endpoint
  '/api/chat', // Public chat API for floating chat
  '/demo', // Demo page for embed chat
]

// Public page routes (don't require authentication)
const publicPageRoutes = [
  '/pricing', // Pricing page
  '/products', // Products page
  '/contact', // Contact page
  '/about', // About page
  '/privacy', // Privacy policy
  '/terms', // Terms of service
  '/blog', // Blog page
  '/login', // Login page
  '/register', // Register page
  '/demo', // Demo page
  '/help', // Help page
  '/solutions', // Solutions page
  '/compliance', // Compliance page
  '/cookies', // Cookies policy
  '/chat', // Chat page
  '/wordpress', // WordPress integration page
  '/embed', // Embed chat page
  '/integrations', // Integrations overview
]


export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Special case: root route is public
  if (pathname === '/') {
    return NextResponse.next()
  }

  // Check if the route is explicitly public
  const isPublicRoute = publicRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Check if it's a public page route (exact match)
  const isPublicPage = publicPageRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  )

  // If it's a public route or public page, continue
  if (isPublicRoute || isPublicPage) {
    return NextResponse.next()
  }

  // All other routes are protected by default
  // Check authentication
  const token = getAuthToken(request) || request.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    // Redirect to login page
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const payload = await verifyTokenForMiddleware(token)

    if (!payload) {
      // Redirect to login page
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Continue to the requested route
  } catch (error) {
    // Redirect to login page on error
    const loginUrl = new URL('/login', request.url)
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