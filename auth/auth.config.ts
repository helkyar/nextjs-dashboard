import type { NextAuthConfig } from 'next-auth'
import github from 'next-auth/providers/github'
import google from 'next-auth/providers/google'
import resend from 'next-auth/providers/resend'

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log('🚀 ~ authorized ~ request:', nextUrl)
      console.log('🚀 ~ authorized ~ auth:', auth)

      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
      return true
    },
  },
  providers: [google, github, resend], // Add providers with an empty array for now
} satisfies NextAuthConfig
