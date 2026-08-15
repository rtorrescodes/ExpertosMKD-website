import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

const locales = ['es', 'en']
const defaultLocale = 'es'

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip i18n for internal routes
  const isInternal = pathname.startsWith('/admin') || pathname.startsWith('/api')

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
