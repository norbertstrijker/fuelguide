import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextResponse } from 'next/server'

const intlMiddleware = createMiddleware(routing)

export default function middleware(request) {
  const response = intlMiddleware(request)

  // Geo-detection: read Vercel's country header, store in cookie
  const existingCountry = request.cookies.get('fg_country')?.value
  if (!existingCountry) {
    const country = request.headers.get('x-vercel-ip-country') || 'US'
    response.cookies.set('fg_country', country, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    })
  }

  return response
}

export const config = {
  matcher: ['/', '/(nl|de|en)/:path*'],
}
