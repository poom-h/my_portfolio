import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PORTFOLIO_ROUTES = ['/about', '/skills', '/experience', '/projects', '/education', '/contact']
const ADMIN_ROUTES = ['/dashboard', '/login']

export function proxy(request: NextRequest) {
  const iface = process.env.NEXT_PUBLIC_INTERFACE ?? 'portfolio'
  const { pathname } = request.nextUrl

  if (iface === 'admin') {
    // Block portfolio-only routes in admin mode
    if (PORTFOLIO_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'))) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    // Redirect root to dashboard
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  if (iface === 'portfolio') {
    // Block admin routes in portfolio mode
    if (ADMIN_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'))) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
