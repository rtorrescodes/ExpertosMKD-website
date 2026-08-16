import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { getToken } from 'next-auth/jwt'

const locales = ['es', 'en']
const defaultLocale = 'es'

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip i18n for internal routes
  const isInternal = pathname.startsWith('/admin') || pathname.startsWith('/api')

  // --- NextAuth Protection for Admin Routes ---
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    const isAuth = !!token
    const isAuthPage = pathname.startsWith('/admin/login')

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
      return NextResponse.next() // Let them access the login page
    }

    if (!isAuth) {
      let from = pathname
      if (request.nextUrl.search) {
        from += request.nextUrl.search
      }
      return NextResponse.redirect(
        new URL(`/admin/login?from=${encodeURIComponent(from)}`, request.url)
      )
    }
    
    // If it's an /admin route and they are authenticated, let the request pass.
    // Admin routes do not need the Supabase `updateSession` logic.
    return NextResponse.next()
  }

  // --- Internationalization Logic (i18n) ---
  if (!isInternal) {
    const pathnameHasLocale = locales.some(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )
    if (!pathnameHasLocale) {
      const url = request.nextUrl.clone()
      
      // Check language preference
      const acceptLanguage = request.headers.get('accept-language') || ''
      const preferredLocale = acceptLanguage.toLowerCase().includes('en') ? 'en' : defaultLocale
      
      // Avoid trailing slash if pathname is just '/'
      url.pathname = `/${preferredLocale}${pathname === '/' ? '' : pathname}`
      return NextResponse.redirect(url)
    }
  }

  // --- Supabase Authentication Logic (for front-end routes) ---
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
