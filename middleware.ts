import NextAuth from 'next-auth'
import { authConfig } from '@/auth/auth.config'
import { NextRequest, NextResponse } from 'next/server'

export const session = NextAuth(authConfig).auth
const protectedRoutes = ['/dashboard', '/dashboard/*', '/api/seed']

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}

export default async function middleware(req: NextRequest) {
  const currentSession = await session()
  if (!currentSession?.user && protectedRoutes.includes(req.nextUrl.pathname)) {
    const absoluteURL = new URL('/', req.nextUrl.origin)
    return NextResponse.redirect(absoluteURL.toString())
  }
}
