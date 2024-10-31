import NextAuth from 'next-auth'
import { authConfig } from '@/auth/auth.config'
import { NextRequest, NextResponse } from 'next/server'

export const session = NextAuth(authConfig).auth
const protectedRoutes = ['/dashboard', '/dashboard/*']

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}

export default async function middleware(req: NextRequest) {
  const currentSession = await session()
  if (!currentSession?.user && protectedRoutes.includes(req.nextUrl.pathname)) {
    const absoluteURL = new URL('/login', req.nextUrl.origin)
    return NextResponse.redirect(absoluteURL.toString())
  }
}

// const publicRoutes = ['/login', '/signup', '/']

// export default async function middleware(req: NextRequest) {
//   // 2. Check if the current route is protected or public
//   const path = req.nextUrl.pathname
//   const isProtectedRoute = protectedRoutes.includes(path)
//   const isPublicRoute = publicRoutes.includes(path)

//   // 3. Decrypt the session from the cookie
//   const session = (await cookies()).get('session')?.value
//   const session = await decrypt(cookie)

//   // 4. Redirect to /login if the user is not authenticated
//   if (isProtectedRoute && !session?.userId) {
//     return NextResponse.redirect(new URL('/login', req.nextUrl))
//   }

//   // 5. Redirect to /dashboard if the user is authenticated
//   if (
//     isPublicRoute &&
//     session?.userId &&
//     !req.nextUrl.pathname.startsWith('/dashboard')
//   ) {
//     return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
//   }

//   return NextResponse.next()
// }
